import React, { useEffect, useRef } from 'react';
import { sculptToMinimalRenderer } from 'https://unpkg.com/shader-park-core/dist/shader-park-core.esm.js';
import { bagelShaderParkCode } from './bagel_shaderParkCode.js';

const Bagel = ({value}) => {
    const canvasRef = useRef();
    const degreeRange1 = 3.2 - 1.8;
    const relationRange2 = 0.8 - 0.37;
    function mapValues(master) {
        let degree, relative;
        degree = (master <= 0.3)*(3.2 - master * (degreeRange1 /0.3));
        degree += (master > 0.3 && master <= 0.6)*(3.2 - 0.3 * (degreeRange1/0.3));
        degree += (master > 0.6)*(1.8 + (master - 0.6) * (degreeRange1 / 0.4));
        relative = 0.37;
        relative += (master > 0.3 && master <= 0.6) * (master - 0.3) * (relationRange2 / 0.3);
        relative += (master > 0.6) * (0.6 - 0.3) * (relationRange2 / 0.3);
        return {degree: degree, relative: relative};
    }
    let state = mapValues(value);
  
    useEffect(() => {
      if (!canvasRef.current) return;
  
      sculptToMinimalRenderer(canvasRef.current, bagelShaderParkCode, () => {
        return {
          degree: state.degree,
          relative: state.relative
        };
      });
    }, []);
  
    return <canvas className="my-canvas2" ref={canvasRef} />
  };

export default Bagel;
