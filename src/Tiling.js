import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import points from './points.json'; // each subarray specifies the vertices of one tile

// the neighbors of a tile are defined to be those which share at least one vertex with that tile
const neighbors = {};
const centroids = {};
for (let i = 0; i < points.length; i++) {
  neighbors[i] = new Set();
}
for (let i = 0; i < points.length; i++) {
  // centroid
  let xs = 0, ys = 0;
  for (const point of points[i]) {
    const [x, y] = point.split(',').map((el) => parseInt(el))
    xs += x;
    ys += y;
  }
  centroids[i] = [Math.round(xs/4), Math.round(ys/4)];

  // neighbors
  for (let i2 = i+1; i2 < points.length; i2++) {
    if (points[i].some(item => points[i2].includes(item))) {
      neighbors[i].add(i2);
      neighbors[i2].add(i);
    }
  }
}


function Tiling(props) {
  const [tileStates, setTileStates] = useState(Array(points.length).fill(0));

  function numberOfNeighborsInState(tileIdx, state) {
    const neighborIndices = [...neighbors[tileIdx]];
    return neighborIndices.filter(neighborIdx => tileStates[neighborIdx] === state).length;
  }
  function getNextTileState(tileIdx) {
    const neighborsInState1 = numberOfNeighborsInState(tileIdx, 1);
    const neighborsInState2 = numberOfNeighborsInState(tileIdx, 2);
    const neighborsInState3 = numberOfNeighborsInState(tileIdx, 3);
    if (tileStates[tileIdx] === 0 && neighborsInState1 >= 1 && (neighborsInState2 >= 1 || neighborsInState3 >= 2)) {
      return 3;
    } else if (tileStates[tileIdx] === 1 && neighborsInState3 >= 1) {
      return 2;
    } else if (tileStates[tileIdx] === 1) {
      return 1;
    } else if (tileStates[tileIdx] === 2) {
      return 3;
    } else {
      return 0;
    }
  }
  useEffect(() => {
    if (props.isPlaying) {
      const intervalId = setInterval(() => {
        let nextTileStates = Array(tileStates.length);
        for (let i = 0; i < tileStates.length; i++) {
          nextTileStates[i] = getNextTileState(i);
        }
        setTileStates(nextTileStates);
      }, 1000); 
      return () => clearInterval(intervalId);
    } 
  }, [props.isPlaying]);

  function handleClick(idx) {
    const nextTileStates = tileStates.slice();
    nextTileStates[idx] = tileStates[idx] === 3 ? 0 : tileStates[idx]+1;
    setTileStates(nextTileStates);
  }

  return (
    <svg width="1280" height="1280" viewBox="0 0 1280 1280" xmlns="http://www.w3.org/2000/svg">
      <g stroke="black" strokeWidth="0.5" fill="transparent">
        {points.map((el, idx) => (
          <Tile 
            key={idx}
            points={el.join(' ')}
            centroid = {centroids[idx]}
            state={tileStates[idx]}
            onClick={() => handleClick(idx)}
          />
        ))}
      </g>
    </svg>
  );
}

export default Tiling;
