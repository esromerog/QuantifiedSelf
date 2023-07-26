import { useEffect, useRef } from "react";
import { spCode } from "./mirrors_shaderpackcode";
import {sculptToMinimalRenderer} from 'shader-park-core';

const Mirrors = ({value, min, max}) => {
    
    const canvasRef = useRef();
    
    let state = {
      buttonHover: 0.0,
      currButtonHover: 0.0,
      click: 0.0,
      currClick: 0.0,
      value: value.current["Size"],
    };



    useEffect(() => {
      const canvas = canvasRef.current;
        
      

      const handleMouseOver = () => (state.buttonHover = 5);
      const handleMouseOut = () => (state.buttonHover = 0.0);
      const handleMouseDown = () => {(state.click = 1.0)};
      const handleMouseUp = () => (state.click = 0.0);
        
      canvas.addEventListener('mouseover', handleMouseOver);
      canvas.addEventListener('mouseout', handleMouseOut);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);

      //canvas.addEventListener("compositionupdate", ()=>{state.value=value});
      //canvas.addEventListener("pointermove", ()=>{state.value=value});

      //canvas.addEventListener("load", startRefresh);


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
  
      sculptToMinimalRenderer(canvasRef.current, spCode, () => {
        state.currButtonHover = state.currButtonHover * 0.999 + state.buttonHover * 0.001;
        state.currClick = state.currClick * 0.97 + state.click * 0.03;
        return {
          buttonHover: state.currButtonHover,
          click: state.currClick,
          _scale: 1.5,
          valor: map(value.current["Size"]),
        };
      });
    }, []);
  
    return <canvas className="my-canvas" ref={canvasRef} />
  };
  
  function map(valor) {
    return valor*2;
  }
  export default Mirrors;


