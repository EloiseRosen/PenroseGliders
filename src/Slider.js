import React from 'react';


function Slider(props) {
  return (
    <div id="speed-slider">
      <input
        type="range"
        id="speed"
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

