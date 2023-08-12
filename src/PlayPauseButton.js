import React from 'react';


/**
 * The PlayPauseButton component controls play/pause functionality.
 */
function PlayPauseButton(props) {
  return (
    <button onClick={props.onClick} id="play-pause-button">
      {props.isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
    </button>
  );
}

export default PlayPauseButton;
