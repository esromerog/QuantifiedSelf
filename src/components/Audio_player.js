import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const SongPlayer = ({volume}) => {
  return (
    <AudioPlayer
      src="https://cdn.glitch.global/5a67df53-0005-444e-a6b5-39c528cf3420/sound_check.mp3?v=1689195989781"
      autoPlay
      controls
      volume={volume} // Initial volume value
    />
  );
};

export default SongPlayer;