import React from 'react';


function Slider(props) {
  return (
    <div>
      <input
        type="range"
        name="speed"
        min="0"
        max={props.max}
        step="50" 
        value={props.sliderVal}
        onChange={props.onChange}
      />
      <label htmlFor="speed">speed</label>
    </div>
  );
}

export default Slider;

