import React, { useEffect, useRef } from 'react';
import { sculptToMinimalRenderer } from 'shader-park-core';
import { shaderParkCode } from './mirrors_shaderpackcode.js';

const Mirrors = ({value, min, max}) => {
  const canvasRef = useRef();
  let state = {
    buttonHover: 0.0,
    currButtonHover: 0.0,
    click: 0.0,
    currClick: 0.0,
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.width=300;
    canvas.height=300;

    const handleMouseOver = () => (state.buttonHover = 5);
    const handleMouseOut = () => (state.buttonHover = 0.0);
    const handleMouseDown = () => (state.click = 1.0);
    const handleMouseUp = () => (state.click = 0.0);

    canvas.addEventListener('mouseover', handleMouseOver);
    canvas.addEventListener('mouseout', handleMouseOut);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      // Cleanup event listeners when component unmounts
      canvas.removeEventListener('mouseover', handleMouseOver);
      canvas.removeEventListener('mouseout', handleMouseOut);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    sculptToMinimalRenderer(canvasRef.current, shaderParkCode, () => {
      const gl = canvasRef.current.getContext('webgl', {powerPreference: 'high-performance'});
      state.currButtonHover = state.currButtonHover * 0.999 + state.buttonHover * 0.001;
      state.currClick = state.currClick * 0.97 + state.click * 0.03;
      return {
        buttonHover: state.currButtonHover,
        click: state.currClick,
        _scale: 1.5,
      };
    });
  }, [state]);

  return <canvas className="my-canvas" height={300} width={300} ref={canvasRef} />
};

export default Mirrors;