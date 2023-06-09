import React from 'react';


function PlayPauseButton(props) {
  return (
    <button onClick={props.onClick} className="play-pause-button">
      {props.isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
    </button>
  );
}

export default PlayPauseButton;
