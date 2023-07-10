import React, { useState } from 'react';
import PlayPauseButton from './PlayPauseButton';
import Tiling from './Tiling';
import Slider from './Slider';
import { Vector } from "./Vector.js";

const largestIntervalMs = 1000;
const smallestIntervalMs = 50;
// slider scale goes from 0 to (largestIntervalMs-smallestIntervalMs)
// then speed in ms is largestIntervalMs-sliderVal


function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderVal, setSliderVal] = useState(500);
  const [size, setSize] = useState(new Vector(window.innerWidth, window.innerHeight));

  // Listen for window resizing.
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
      <Tiling
        isPlaying={isPlaying}
        speed={largestIntervalMs-sliderVal}
        size={size}
      />
      <Slider
        max={largestIntervalMs-smallestIntervalMs}
        sliderVal={sliderVal}
        onChange={(event) => setSliderVal(event.target.value)}
      />
    </>
  );
}

export default App;
