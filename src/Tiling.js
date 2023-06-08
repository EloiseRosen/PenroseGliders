import React, { useState } from 'react';
import Tile from './Tile';
import dValues from './d-values.json'; // the svg <path> d attribute values for each tile


function Tiling() {
  const [tileStates, setTileStates] = useState(Array(dValues.length).fill(0));

  function handleClick(idx) {
    const nextTileStates = tileStates.slice();
    nextTileStates[idx] = tileStates[idx] === 4 ? 0 : tileStates[idx]+1;
    setTileStates(nextTileStates);
  }

  return (
    <svg width="1280" height="1280" viewBox="0 0 1280 1280" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#000000" strokeWidth="0.5" fill="transparent">
        {dValues.map((el, idx) => (
          <Tile key={idx} d={el} state={tileStates[idx]} onClick={() => handleClick(idx)} />
        ))}
      </g>
    </svg>
  );
}

export default Tiling;
