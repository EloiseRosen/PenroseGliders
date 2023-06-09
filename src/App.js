import React, { useState } from 'react';
import PlayPauseButton from './PlayPauseButton';
import Tiling from './Tiling';


function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <PlayPauseButton isPlaying={isPlaying} onClick={() => setIsPlaying(prev => !prev)} />
      <Tiling isPlaying={isPlaying} />
    </>
  );
}

export default App;
