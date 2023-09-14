import React, { useEffect } from 'react';
import Sketch from 'react-p5';
import P5 from 'p5';


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

const SignalView = ({value}) => {
     const Sketch = (p, value, canvasRef) => {
        // helper function
        function drawTimeSeries(p5_instance,ts, xOffset, lowerbound, upperbound) {
          p5_instance.beginShape();
          for (let i = 0; i < canvasRef.current.offsetWidth && i < ts.length; i++) {
            p5_instance.vertex((xOffset - i), p5_instance.map(ts[ts.length - i - 1], minimum, maximum, upperbound, lowerbound));
          }
          p5_instance.endShape(); 
        }

        // define parameters
        let minimum = -0.5;
        let maximum = 1.5;
        let timeSeries = [];
        let chn_names = ['AF3', 'F7', 'F3', 'FC5', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'FC6', 'F4', 'F8', 'AF4'];
        let chn = chn_names.length;
        let signal_names = Object.keys(value.current);
        // time series lists for all the channels
        const ts_channels = [];
        for (let i = 0; i < chn; i++) {
          ts_channels.push([]);
        }

        //p5 functions
        p.setup = () => {
          p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);

        };

        p.draw = () => {
          p.background(220);
          for (let k = 0; k < chn; k++) {
            ts_channels[k].push(value.current[signal_names[k]]);
            if (ts_channels[k].length > canvasRef.current.offsetWidth) {
              ts_channels[k].shift();
            }
            if (ts_channels[k].length >= 2) {
              p.rect(0, 0, canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
              p.noFill();
              drawTimeSeries(p,ts_channels[k], canvasRef.current.offsetWidth, k*canvasRef.current.offsetHeight/chn, (k+1)*canvasRef.current.offsetHeight/chn);
            }
          }
        };

    };

   return (
        <P5Wrapper sketch={Sketch} params={value}/>
    )
};

export default SignalView;