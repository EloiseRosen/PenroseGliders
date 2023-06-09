import React from 'react';

const activeColors = {1: 'pink', 2: 'yellow', 3: 'coral'}


function Tile(props) {
  return (
    <>
      <polygon
        points={props.verticesString}
        fill={props.state > 0 ? activeColors[props.state] : props.tileType === 1 ? 'lightgray' : 'gray'}
        onClick={props.onClick}
      />
      {/* for displaying state on tile:
      <text x={props.centroid[0]} y={props.centroid[1]} fill="black" onClick={props.onClick}>
        {props.state}
      </text>
      */}
    </>
  );
}

export default Tile;
