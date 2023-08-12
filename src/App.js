import React, { useState } from 'react';
import PlayPauseButton from './PlayPauseButton';
import Tiling from './Tiling';
import Slider from './Slider';
import Info from './Info';
import { Vector } from "./Vector.js";

// slider scale goes from 0 to (largestIntervalMs-smallestIntervalMs)
// then speed in ms is largestIntervalMs-sliderVal
const largestIntervalMs = 1000;
const smallestIntervalMs = 50;


/**
 * The App component is the main component, which has state for play speed, current play/pause
 * state, and window size. It contains the components for the play button, the speed slider,
 * the tiling itself, and the info box.
 */
function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderVal, setSliderVal] = useState(500);
  const [size, setSize] = useState(new Vector(window.innerWidth, window.innerHeight));

  /**
   * Listen for window resizing.
   */
  React.useEffect(() => {
    function handleResize() {
      setSize(new Vector(window.innerWidth, window.innerHeight));
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <>
      <PlayPauseButton isPlaying={isPlaying} onClick={() => setIsPlaying(prev => !prev)} />
      <Slider
        max={largestIntervalMs-smallestIntervalMs}
        sliderVal={sliderVal}
        onChange={(event) => setSliderVal(event.target.value)}
      />
      <Tiling
        isPlaying={isPlaying}
        speed={largestIntervalMs-sliderVal}
        size={size}
      />
      <Info />
    </>
  );
}

export default App;
