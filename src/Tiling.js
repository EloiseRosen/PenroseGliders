import React, { useState } from 'react';
import Tile from './Tile';
import points from './points.json'; // each subarray specifies the vertices of one tile

// the neighbors of a tile are defined to be those which share at least one vertex with that tile
const neighbors = {};
for (let i = 0; i < points.length; i++) {
    neighbors[i] = new Set();
}
for (let i = 0; i < points.length; i++) {
    for (let i2 = i+1; i2 < points.length; i2++) {
        if (points[i].some(item => points[i2].includes(item))) {
            neighbors[i].add(i2);
            neighbors[i2].add(i);
        }
    }
}
console.log(neighbors);


function Tiling() {
  const [tileStates, setTileStates] = useState(Array(points.length).fill(0));

  function handleClick(idx) {
    const nextTileStates = tileStates.slice();
    nextTileStates[idx] = tileStates[idx] === 4 ? 0 : tileStates[idx]+1;
    setTileStates(nextTileStates);
  }

  return (
    <svg width="1280" height="1280" viewBox="0 0 1280 1280" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#000000" strokeWidth="0.5" fill="transparent">
        {points.map((el, idx) => (
          <Tile key={idx} points={el.join(' ')} state={tileStates[idx]} onClick={() => handleClick(idx)} />
        ))}
      </g>
    </svg>
  );
}

export default Tiling;
