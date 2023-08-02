import React, { useRef, useState, useEffect } from 'react';

var currentFilter = 0;
var currentGain = 0;
var easing = 0.1;
var gammaThreshold = 0.6;

const AudioPlayerWithFilter = ({value}) => {

  const audioRef = useRef(null);
  const [context, setContext] = useState(null);
  const [bassNode, setbassNode] = useState(null);
  const [highNode, sethighNode] = useState(null);
  const [chimesNode, setchimesNode] = useState(null);


  let alphaUrl = 'https://cdn.glitch.global/5a67df53-0005-444e-a6b5-39c528cf3420/alpha.mp3?v=1689885015601';
  let betaUrl = 'https://cdn.glitch.global/5a67df53-0005-444e-a6b5-39c528cf3420/beta.mp3?v=1690921282654';
  let gammaUrl = 'https://cdn.glitch.global/5a67df53-0005-444e-a6b5-39c528cf3420/gamma.mp3?v=1690921254137';

  useEffect(() => {
    //  Create an AudioContext when the component mounts
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    setContext(audioContext);

    // Clean up the audioContext and any active audio sources when the component unmounts
    return () => {
      if (bassNode) {
        bassNode.disconnect();
      }
      if (highNode) {
        highNode.disconnect();
      }
      if (chimesNode) {
        chimesNode.disconnect();
      }
      audioContext.close().catch((e) => console.error(e));
    };
  }, []);

  useEffect(() => {
    if (context && bassNode) {
      // transform the filter value
      const mappedFrequency = mapRange(value.current['Bass source'], 0, 1, 2, 3);
      // Update the bandpass filter frequency when the "frequency" prop changes
      setSmoothFilter(mappedFrequency);
      bassNode.frequency.setValueAtTime(Math.pow(10, currentFilter), context.currentTime);
    }
    if (context && highNode) {
      let volume =  mapRange(value.current['High Pitch source'], 0, 1, 0.2, 1.3);
      setSmoothGain(volume);
      highNode.gain.value = currentGain; // Set the initial volume based on the 'volume' prop
    }
    if (context && chimesNode) {
      let volume = value.current['Chimes source'] < 0.6 ? 0 : 1;
      setSmoothGain(volume);
      chimesNode.gain.value = currentGain; // Set the initial volume based on the 'volume' prop
    }
  }, [value, context]);

  const loadAudio = () => {
    if (!context) return;

    //THE ALPHA AUDIO
    loadSound(alphaUrl, context, (buffer) => {
      const alphaSource = context.createBufferSource();
      alphaSource.buffer = buffer;
      // If there is an existing bassNode, disconnect it before connecting the new one
      if (bassNode) {
        bassNode.disconnect();
      }
      // Create a BiquadbassNode for the bandpass filter
      const filter = context.createBiquadFilter();
      // Update the bandpass filter frequency when the "frequency" prop changes
      filter.type = 'bandpass';
      alphaSource.connect(filter);
      filter.connect(context.destination);
      // Store the bassNode in the state
      setbassNode(filter);
      // Start the first audio source
      alphaSource.start();
      });
    
    // THE BETA AUDIO
    // Load and create the second audio buffer source
    loadSound(betaUrl, context, (secondBuffer) => {
      const betaSource = context.createBufferSource();
      betaSource.buffer = secondBuffer;
      if (highNode) {
              highNode.disconnect();
            }
      // Create a GainNode for controlling the volume of the second audio source
      const gainNode = context.createGain();
      betaSource.connect(gainNode);
      gainNode.connect(context.destination);
      sethighNode(gainNode);

      betaSource.start();
      });
    
    // THE GAMMA AUDIO
    // Load and create the second audio buffer source
    loadSound(gammaUrl, context, (thirdBuffer) => {
      const gammaSource = context.createBufferSource();
      gammaSource.buffer = thirdBuffer;
      if (gammaSource) {
              gammaSource.disconnect();
            }
      // Create a GainNode for controlling the volume of the second audio source
      const gainNode = context.createGain();
      gammaSource.connect(gainNode);
      gainNode.connect(context.destination);
      setchimesNode(gainNode);

      gammaSource.start();
      });

  };

  return (
    <div>
      <audio ref={audioRef} controls />
      <button onClick={loadAudio}>Load Audio</button>
    </div>
  );
};

export default AudioPlayerWithFilter;

// helper functions
function mapRange(value, fromMin, fromMax, toMin, toMax) {
  return toMin + ((value - fromMin) / (fromMax - fromMin)) * (toMax - toMin);
}

function loadSound(url, context, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function () {
    context.decodeAudioData(request.response, function (buffer) {
      callback(buffer);
    }, Error);
  };

  request.send();
}

function setSmoothFilter(target) {
    let delta = target - currentFilter;
    currentFilter += delta * easing;
};

function setSmoothGain(target) {
    let delta = target - currentGain;
    currentGain += delta * easing;
};