import React from 'react';
import Tile from './Tile';


function Grid() {
  return (
  <svg width="1280" height="1280" viewBox="0 0 1280 1280" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#000000" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" fill="transparent">
      <Tile />
    </g>
  </svg>
  );
}

export default Grid;
