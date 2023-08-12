import React from 'react';


/**
 * The Slider component controls the speed of the cellular automaton steps.
 */
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

