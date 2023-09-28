import React, { useEffect } from 'react';
import Sketch from 'react-p5';
import P5 from 'p5';

var t;

function P5Wrapper({sketch, params}) {
    const canvasRef = React.useRef();

    useEffect(() => {

        const Q = new P5(p => sketch(p, params, canvasRef), canvasRef.current);

        canvasRef.current.firstChild.style.visibility = "visible"
        function updateCanvasDimensions() {
            Q.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
            Q.redraw();
        }

        window.addEventListener("resize", updateCanvasDimensions, true);

        // Super important cleanup function
        return () => {
            Q.noLoop();
            Q.remove();
            window.removeEventListener("resize", updateCanvasDimensions, true);
        }
    }, []);

    return (
        <div className="h-100" ref={canvasRef} />
    ); 

}

function divideIfNotZero(numerator, denominator) {
  if (denominator === 0 || isNaN(denominator)) {
        return 0;
  }
  else {
        return numerator / denominator;
  }
}

const Flower = ({ value }) => {
	/*
	* flower class
	* https://openprocessing.org/sketch/724567
	*/

	function flower(p5, values, sum, colors, width, height, r, c, petalCount, circleCount, maxRad, minRad, frac, rot) {
	  let rad = 0;
	  p5.noStroke();
	  p5.push();
	  p5.translate(width / 2, height / 2);
	  for (let j = 0; j < petalCount; j++) {
	    for (let i = c; i <= circleCount; i++) {
	      let tt = i / circleCount;
	      let x = r * tt * p5.cos(tt * rot + (2 * p5.PI * j) / petalCount - p5.PI / 2);
	      let y = r * tt * p5.sin(tt * rot + (2 * p5.PI * j) / petalCount - p5.PI / 2);
	      let petalSize = divideIfNotZero(values[j],sum)+0.7;
	      if (i < frac * circleCount) {
	        rad = p5.map(i, 0, frac * circleCount, minRad, maxRad*petalSize);
	      } else {
	        rad = p5.map(i, frac * circleCount, circleCount, maxRad*petalSize, minRad);
	      }

	      // let col1 = p5.color(255 * t, 255, 0, 10);
	      let col2 = p5.color(50 * t+205 , 255*(1-t), 200, 200);
	      let col1 = colors[j];
	      col1.setAlpha(255 * t);
	      p5.fill(p5.lerpColor(col1, col2, i / circleCount-0.4));
	      p5.ellipse(x, y, 2 * rad, 2 * rad);
	    }
	  }
	  p5.pop();
	}

    const Sketch = (p, value, canvasRef) => {
    	let theta = p.color(72, 50, 133); //blue
		let alpha = p.color(37, 167, 0); //green
		let beta1 = p.color(247, 213, 30); //bright yellow
		let beta2 = p.color(247, 148, 30); //orange
		let gamma = p.color(237, 25, 33); //gamma
		let colors = [theta, alpha, beta1, beta2, gamma]
        p.setup = () => {
        	p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
        };
        p.draw = () => {
        	p.background(0);
        	// compute the sum
        	let values = Object.values(value.current);
        	let sum = values.reduce((acc, currentValue) => Math.abs(acc) + Math.abs(currentValue), 0);
  			t = (0.3*p.abs(p.sin(p.frameCount * 0.004)))+0.8;
  			flower(p, values, sum, colors, canvasRef.current.offsetWidth, canvasRef.current.offsetHeight,
  				150 * t + 100, 10, 5, 100, 68, 0.1 * (t) + 0.1, 0.6, p.PI * (1 - t));
        };
	};
	return (
        <P5Wrapper sketch={Sketch} params={value}/>
    )
};

export default Flower;
