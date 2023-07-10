import React, { useState } from 'react';
import PlayPauseButton from './PlayPauseButton';
import Tiling from './Tiling';
import Slider from './Slider';

const largestIntervalMs = 1000;
const smallestIntervalMs = 50;
// slider scale goes from 0 to (largestIntervalMs-smallestIntervalMs)
// then speed in ms is largestIntervalMs-sliderVal


function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderVal, setSliderVal] = useState(500);

  return (
    <>
      <PlayPauseButton isPlaying={isPlaying} onClick={() => setIsPlaying(prev => !prev)} />
      <Tiling isPlaying={isPlaying} speed={largestIntervalMs-sliderVal} />
      <Slider
        max={largestIntervalMs-smallestIntervalMs}
        sliderVal={sliderVal}
        onChange={(event) => setSliderVal(event.target.value)}
      />
    </>
  );
}

export default App;
