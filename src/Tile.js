import React from 'react';

// state corresponds to index (e.g. state 0 is the color at index 0)
const stateToColor = ['lightgray', 'pink', 'yellow', 'coral', 'cyan']


function Tile(props) {
  return (
    <>
      <polygon
        points={props.points}
        fill={stateToColor[props.state]} 
        onClick={props.onClick}
      />
      <text x={props.centroid[0]} y={props.centroid[1]} fill="black" onClick={props.onClick}>
        {props.idx}
      </text>
    </>
  );
}

export default Tile;
