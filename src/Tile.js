import React, { useState } from 'react';

const stateToColor = ['orange', 'black', 'red', 'pink', 'green'] // state corresponds to index (e.g. state 0 is orange)


function Tile() {
  const [state, setState] = useState(0);

  return (
    <path 
      d="M812,514 L878,311 L705,437 L640,640 Z" 
      fill={stateToColor[state]} 
      onClick={() => setState((prevState) => prevState === 4 ? 0 : prevState+1)}
    />
  );
}

export default Tile;
