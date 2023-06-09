import React, { useState, useEffect } from 'react';
import PlayPauseButton from './PlayPauseButton';
import Tiling from './Tiling';


function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(() => {
        console.log('hi');
      }, 1000); 
      return () => clearInterval(intervalId);
    } 
  }, [isPlaying]);

  return (
    <>
      <PlayPauseButton isPlaying={isPlaying} onClick={() => setIsPlaying(prev => !prev)} />
      <Tiling />
    </>
  );
}

export default App;
