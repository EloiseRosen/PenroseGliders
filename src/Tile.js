import React from 'react';

const activeColors = {1: 'var(--coral)', 2: 'var(--orange)', 3: 'var(--green)'};


/**
 * The Tile component represents an individual tile. The tile displays the number of the state that it's in.
 * The Tile color also reflects its state.
 */
function Tile(props) {
  return (
    <>
      <polygon
        points={props.verticesString}
        fill={props.state > 0 ? activeColors[props.state] : props.tileType === 1 ? 'var(--extra-light-gray)' : 'var(--light-gray)'}
        onPointerUp={props.onClick}
      />
      <text x={props.centroid[0]} y={props.centroid[1]} fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="12" onMouseUp={props.onClick}>
        {props.state !== 0 && props.state}
      </text>
    </>
  );
}

export default Tile;
