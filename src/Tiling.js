import React, { useState, useEffect, useCallback } from 'react';
import Tile from './Tile';
import { Vector } from "./Vector.js";

/*

    Spaces:

        world: where the tiles reside, independent of view. Includes scale.
        view: shifted onto the screen.
        grid: space that the basis vectors reside in.
        tuple: 5-tuple of numbers representing how much of each basis vector.

*/

/*

    to do:
        - speed up redrawing.
            - try svg we update.
                - how to get react to not touch it?
            - try canvas.
        - when game algorithm needs missing neighbor, generate it.
            - how to know if it's missing?
                - maybe always do it?
            - use tiny viewport to generate missing neighbors.

*/

const DIMS = 5;
const VIEW_SCALE = 80;

// String of vertex coordinate ("x,y") to array of indices of faces with that vertex.
const vertexMap = new Map();

// Centroid ("x,y") of already-generated tiles.
const generatedTileIds = new Set();

// Array of information about each tile:
//     vertices: array of [x,y] vertices in world space.
//     tileType: 1 for thick, 2 for thin.
//     neighbors: set of indices of neighbors (sharing at least one vertex).
//     centroid: [x,y] location of centroid of tile in world space, for text.
const tileData = [];

// Make the basis vectors. These are equidistant around the unit circle.
const basis = range(DIMS)
    .map(i => Vector.fromPolar(1, 2*Math.PI*i/DIMS));

// Make the offset constants. 0.3 is the "Penrose sun".
const gamma = new Array(DIMS).fill(0.3);

/**
 * Make a new array of size count with values 0 to count-1.
 */
function range(count: number): number[] {
    return new Array(count).fill(0).map((elm, i) => i);
}

/**
 * Given the index of a tile that was just added to tileData, fill in its
 * neighbors field and update the neighbors fields of its neighbors.
 */
function computeTileNeighbors(i) {
    const tile = tileData[i];

    for (const v of tile.vertices) {
        // Find the vertex in the map, adding if necessary.
        const sv = v.join(",");
        let indexList = vertexMap.get(sv);
        if (indexList === undefined) {
            indexList = [];
            vertexMap.set(sv, indexList);
        }

        // Update all neighbors arrays.
        for (const j of indexList) {
            // In case vertices collapse.
            if (j !== i) {
                tileData[i].neighbors.add(j);
                tileData[j].neighbors.add(i);
            }
        }

        // Add ourselves for this vertex.
        indexList.push(i);
    }
}

/**
 * Convert a DIMS-length array to world space. The array describes
 * how much of each basis we want.
 */
function tupleToWorld(n: number[]): Vector {
    let p = Vector.ZERO;

    for (let i = 0; i < DIMS; i++) {
        p = p.plus(basis[i].times(n[i] - gamma[i]));
    }

    // We divide by half the number of dimensions because
    // the some of the squares of the dot products adds up
    // to that, so our result is too high by this factor.
    return p.times(VIEW_SCALE).dividedBy(DIMS/2).round();
}

/**
 * Inverse of tupleToWorld().
 */
function worldToTuple(v: Vector): number[] {
    const n: number[] = [];

    v = v.dividedBy(VIEW_SCALE);

    for (let i = 0; i < DIMS; i++) {
        n.push(v.dot(basis[i]) + gamma[i]);
    }

    return n;
}

/**
 * Converts a world-space location to view space.
 */
function worldToView(v: Vector, translation: Vector): Vector {
    return v.plus(translation);
}

/**
 * Converts a view-space location to world space.
 */
function viewToWorld(v: Vector, translation: Vector): Vector {
    return v.minus(translation);
}

/**
 * Given the bounds of a view (upper left and lower right) returns the
 * min and max values of each basis to cover that view.
 */
function getBounds(v1: Vector, v2: Vector, translation: Vector): number[2][DIMS] {
    const corners = [
        v1,
        new Vector(v1.x, v2.y),
        new Vector(v2.x, v1.y),
        v2,
    ];

    let min = new Array(DIMS).fill(Infinity);
    let max = new Array(DIMS).fill(-Infinity);

    for (const v of corners) {
        const n = worldToTuple(viewToWorld(v, translation));

        for (let i = 0; i < DIMS; i++) {
            min[i] = Math.min(min[i], Math.floor(n[i]));
            max[i] = Math.max(max[i], Math.ceil(n[i]));
        }
    }

    return [min, max];
}

/**
 * Given two rays (p for origin point, r for direction), return their
 * intersection, or undefined if they're parallel.
 */
function intersectRays(pi, ri, pj, rj) {
    const d = pi.minus(pj);

    // Find how far along our own ray we intersect the other line.
    const denom = ri.det(rj);
    if (Math.abs(denom) < 1e-3) {
        return undefined;
    }
    const t = rj.det(d) / denom;
    return pi.plus(ri.times(t));
}

/**
 * Generate all the tiles visible in the current view that haven't yet been
 * generated.
 */
function generatePenroseTiling(translation, size) {
    const before = new Date().getTime();

    const [min, max] = getBounds(Vector.ZERO, size, translation);

    let newTileCount = 0;

    // Go through all possible pairs of lines.
    for (let i = 0; i < DIMS - 1; i++) {
        for (let j = i + 1; j < DIMS; j++) {
            // Go through all possible visible lines of each.
            for (let ni = min[i]; ni <= max[i]; ni++) {
                for (let nj = min[j]; nj <= max[j]; nj++) {
                    // Make rays for each.
                    const pi = basis[i].times(ni - gamma[i]);
                    const pj = basis[j].times(nj - gamma[j]);
                    const ri = basis[i].perpendicular();
                    const rj = basis[j].perpendicular();

                    // Intersect the rays. Result is in grid space.
                    const v = intersectRays(pi, ri, pj, rj);
                    if (v === undefined) {
                        console.log("bases are parallel");
                        continue;
                    }

                    // Construct the 5-tuple describing one of the vertices.
                    const n: number[] = [];
                    for (let k = 0; k < DIMS; k++) {
                        if (k === i) {
                            n.push(ni);
                        } else if (k === j) {
                            n.push(nj);
                        } else {
                            n.push(Math.floor(basis[k].dot(v) + gamma[k]));
                        }
                    }

                    // Generate vertices. There's an easier way to do this where
                    // we just add the basis vectors.
                    const vertices = [];
                    vertices.push(tupleToWorld(n).toArray());
                    n[i] -= 1;
                    vertices.push(tupleToWorld(n).toArray());
                    n[j] -= 1;
                    vertices.push(tupleToWorld(n).toArray());
                    n[i] += 1;
                    vertices.push(tupleToWorld(n).toArray());

                    // Compute centroid.
                    let c = Vector.ZERO;
                    for (const v of vertices) {
                        c = c.plus(Vector.fromArray(v));
                    }
                    c = c.dividedBy(vertices.length).round();

                    // See if the centroid is visible in the view.
                    const vc = worldToView(c, translation);
                    const margin = VIEW_SCALE;
                    if (vc.x < -margin || vc.y < -margin ||
                        vc.x > size.x + margin || vc.y > size.y + margin) {

                        continue;
                    }

                    // See if we've generated this tile before.
                    const id = c.toString();
                    if (generatedTileIds.has(id)) {
                        continue;
                    }
                    generatedTileIds.add(id);

                    // Generate the tile.
                    const thick = j - i === 1 || j - i === 4;
                    tileData.push({
                        vertices: vertices,
                        tileType: thick ? 1 : 2,
                        neighbors: new Set(),
                        centroid: c.toArray(),
                    });
                    computeTileNeighbors(tileData.length - 1);
                    newTileCount += 1;
                }
            }
        }
    }

    const after = new Date().getTime();

    console.log(newTileCount, "new tiles",
                tileData.length, "total tiles",
                after - before, "ms",
                translation.toArray(), "translate");
}

function Tiling(props) {
  // Array from index to tile state (0, 1, 2, 3).
  const [tileStates, setTileStates] = useState(Array(tileData.length).fill(0));
  // Vector of view translation.
  const [translation, setTranslation] = useState(props.size.dividedBy(2));
  // Whether the mouse button is pressed.
  const [mouseDown, setMouseDown] = useState(false);
  // Vector of last location of mouse client coordinates.
  const [mousePreviousLocation, setMousePreviousLocation] = useState(Vector.ZERO);
  // Vector of location of mouse client coordinates on mouse click.
  const [mouseClickLocation, setMouseClickLocation] = useState(Vector.ZERO);

  const numberOfNeighborsInState = useCallback((tileIdx, state) => {
    const neighborIndices = [...tileData[tileIdx].neighbors];
    return neighborIndices.filter(neighborIdx => tileStates[neighborIdx] === state).length;
  }, [tileStates]);
  const getNextTileState = useCallback((tileIdx) => {
    const neighborsInState1 = numberOfNeighborsInState(tileIdx, 1);
    const neighborsInState2 = numberOfNeighborsInState(tileIdx, 2);
    const neighborsInState3 = numberOfNeighborsInState(tileIdx, 3);
    if (tileStates[tileIdx] === 0 && neighborsInState1 >= 1 && neighborsInState2 >= 1) {
      return 3;
    } else if (tileStates[tileIdx] === 0 && neighborsInState1 >= 1 && neighborsInState3 >= 2) {
      return 1;
    } else if (tileStates[tileIdx] === 1 && neighborsInState3 >= 1) {
      return 2;
    } else if (tileStates[tileIdx] === 1) {
      return 1;
    } else if (tileStates[tileIdx] === 2) {
      return 3;
    } else {
      return 0;
    }
  }, [tileStates, numberOfNeighborsInState]);

  useEffect(() => {
    if (props.isPlaying) {
      const intervalId = setInterval(() => {
        const nextTileStates = Array(tileStates.length);
        for (let i = 0; i < tileStates.length; i++) {
          nextTileStates[i] = getNextTileState(i);
        }
        setTileStates(nextTileStates);
      }, props.speed);
      return () => clearInterval(intervalId);
    } 
  }, [props.isPlaying, props.speed, tileStates, getNextTileState]);

  // Generate set of tiles.
  generatePenroseTiling(translation, props.size);

  // Extend the state array if necessary.
  if (tileStates.length < tileData.length) {
      setTileStates([...tileStates, ...Array(tileData.length - tileStates.length).fill(0)]);
  }

  function handleClick(idx) {
    const nextTileStates = tileStates.slice();
    nextTileStates[idx] = tileStates[idx] === 3 ? 0 : tileStates[idx]+1;
    setTileStates(nextTileStates);
  }

  function handleMouseEnter(e) {
      setMouseDown(e.buttons !== 0);
  }

  function handleMouseDown(e) {
      const location = new Vector(e.clientX, e.clientY);

      setMouseDown(true);
      setMousePreviousLocation(location);
      setMouseClickLocation(location);
  }

  function handleMouseMove(e) {
      // We need to check both mouseDown and e.buttons because mouseDown may be
      // out of date if the event happens after a setMouseDown() but before
      // a redraw.
      if (mouseDown && e.buttons !== 0) {
          const location = new Vector(e.clientX, e.clientY);
          const movement = location.minus(mousePreviousLocation);

          const newTranslation = translation.plus(movement);

          setTranslation(newTranslation);
          setMousePreviousLocation(location);
      }
  }

  function handleMouseUp(e) {
      const location = new Vector(e.clientX, e.clientY);
      const movement = location.minus(mouseClickLocation);

      setMouseDown(false);

      if (movement.length() > 2) {
          e.stopPropagation();
      }
  }

  return (
    <svg viewBox={`0 0 ${props.size.x} ${props.size.y}`} xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={handleMouseEnter}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUpCapture={handleMouseUp}>
      <g stroke="black" strokeWidth="0.5" fill="transparent" transform={`translate(${translation.x} ${translation.y})`}>
        {tileData.map((el, idx) => (
          <Tile 
            key={idx}
            verticesString={el.vertices.map(pair => pair.join(',')).join(' ')}
            tileType={el.tileType}
            centroid={el.centroid}
            state={tileStates[idx]}
            onClick={() => handleClick(idx)}
          />
        ))}
      </g>
    </svg>
  );
}

export default Tiling;
