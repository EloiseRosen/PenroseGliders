import React from 'react';

const stateToColor = ['lightgray', 'pink', 'yellow', 'coral', 'cyan'] // state corresponds to index (e.g. state 0 is the color at index 0)


function Tile(props) {
  return (
    <path 
      d={props.d}
      fill={stateToColor[props.state]} 
      onClick={props.onClick}
    />
  );
}

export default Tile;
