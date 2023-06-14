import React, { useState, useEffect, useCallback } from 'react';
import Tile from './Tile';
import tileData from './tileData.json';

// the neighbors of a tile are defined to be those which share at least one vertex with that tile
const neighbors = {};
const centroids = {}; // for displaying number in middle of tile
for (let i = 0; i < tileData.length; i++) {
  neighbors[i] = new Set();
}
for (let i = 0; i < tileData.length; i++) {
  const vertices = tileData[i].vertices;

  // centroid
  let xs = 0, ys = 0;
  for (const [x, y] of vertices) {
    xs += x;
    ys += y;
  }
  centroids[i] = [xs/4, ys/4];

  // neighbors
  for (let i2 = i+1; i2 < tileData.length; i2++) {
    if (vertices.some(v1 => tileData[i2].vertices.some(v2 => v1[0] === v2[0] && v1[1] === v2[1]))) {
      neighbors[i].add(i2);
      neighbors[i2].add(i);
    }
  }
}


function Tiling(props) {
  const [tileStates, setTileStates] = useState(Array(tileData.length).fill(0));

  const numberOfNeighborsInState = useCallback((tileIdx, state) => {
    const neighborIndices = [...neighbors[tileIdx]];
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
      }, 1000); 
      return () => clearInterval(intervalId);
    } 
  }, [props.isPlaying, tileStates, getNextTileState]);

  function handleClick(idx) {
    const nextTileStates = tileStates.slice();
    nextTileStates[idx] = tileStates[idx] === 3 ? 0 : tileStates[idx]+1;
    setTileStates(nextTileStates);
  }

  return (
    <svg viewBox="0 0 1280 1280" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" strokeWidth="0.5" fill="transparent">
        {tileData.map((el, idx) => (
          <Tile 
            key={idx}
            verticesString={el.vertices.map(pair => pair.join(',')).join(' ')}
            tileType={el.tileType}
            centroid={centroids[idx]}
            state={tileStates[idx]}
            onClick={() => handleClick(idx)}
          />
        ))}
      </g>
    </svg>
  );
}

export default Tiling;
