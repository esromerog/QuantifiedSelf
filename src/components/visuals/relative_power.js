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


const PowerBars = ({value}) => {
     const Sketch = (p, value, canvasRef) => {
        let width = canvasRef.current.offsetWidth;
        let height = canvasRef.current.offsetHeight;
        let ts = [];
        let ts_key = 'val1';
        var keys = ['val1','val2','val3','val4','val5'];
        var xlabels = ['Theta','Alpha',"Low beta","High beta","Gamma"]; //data for the x axis
        var colors = ["#f9b820","#f9b820","#f9b820","#f9b820","#f9b820"];

        var marginTop = 1/8*height;
        var marginLeft = 1/30*width; 
        var marginRight = 1/60*width;
        var marginBottom = 1/30*height;
        var graphWidth = 4/5*width;
        var graphHeight = 1/3*height;
        var graph2Height = 1/3*height;
        let vert_x = marginLeft+1/16*width;
        let vert_y1 = marginTop-1/20*height;  //up
        let vert_y2 = marginTop+1/20*height+graphHeight;  //down
        let graphOffset = 0.2*height+graph2Height;
        let secondGraphShrink = 0.8;

        p.setup = () => {
          p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);

        };

        p.draw = () => {
          p.background(255);
          p.fill(0);
          p.textSize(20);
          p.text("Relative Power Values", width/2+marginLeft, marginTop/2);
          //let values = Object.values(value.current);
          // let sum = values.reduce((acc, currentValue) => acc + currentValue, 0);
          /*
          * axes
          */
          //function that draws the axes, with a yOffset, ie move vertically
          function draw_axes(yOffset,shrink){
            //draw vertical axis
            p.line(vert_x, shrink*vert_y1+yOffset, vert_x, shrink*vert_y2+yOffset);
            //10 ticks, spaced 50px apart
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(15);
            for (var t=0; t<= 10; t+= 1) {
              p.line(vert_x-5, shrink*(vert_y1+(vert_y2-vert_y1)*t/10)+yOffset, vert_x, shrink*(vert_y1+(vert_y2-vert_y1)*t/10)+yOffset);
              p.text(p.round(0.1*(10-t),1), vert_x-20, shrink*(vert_y1+(vert_y2-vert_y1)*t/10)+yOffset);
            }
            // draw ylabels
            p.push();
            p.textSize(20);
            let angle = p.radians(270);
            p.rotate(angle);
            p.translate(-shrink*(vert_y1+0.5*(vert_y2-vert_y1))-yOffset,1/30*width);
            p.text("relative power", 0,0);
            p.pop();
            
            //draw horizontal axis
            p.textSize(20);
            p.line(vert_x, shrink*(vert_y2)+yOffset, vert_x+graphWidth, shrink*(vert_y2)+yOffset);
          }
          draw_axes(0,1);  // axes for graph1
          draw_axes(graphOffset,secondGraphShrink);  // axes for graph2
          // draw xlabel for graph2
          p.push();
          p.textSize(20);
          p.text("time", vert_x+graphWidth/2,secondGraphShrink*(vert_y2+20)+graphOffset);
          p.pop();
          /*
          * bar plot code
          */
          for (var t=0; t<xlabels.length; t++) {
              p.push();
              p.fill(0);
              p.text(xlabels[t], vert_x+graphWidth*(1/xlabels.length*(t+0.5)), vert_y2+20);
              p.fill(colors[t]);
              let barwidth = graphWidth*1/xlabels.length*2/4;
              p.rect(vert_x+graphWidth*(1/xlabels.length*t)+1/2*barwidth, vert_y2, barwidth, -p.map(value.current[keys[t]],0,1,0,vert_y2-vert_y1));
              p.pop();
              }
          /*
          * time series code
          */
          let upper = secondGraphShrink*vert_y1+graphOffset;  //up
          let lower = secondGraphShrink*vert_y2+graphOffset;  //down

          // time series
          ts.push(value.current[ts_key]); //todo
          if (ts.length > graphWidth) {
            ts.shift();
          }
          if (ts.length >= 2) {
            //rect(0, 0, width, height);
            p.noFill();
            drawTimeSeries(p, ts, vert_x+graphWidth, graphWidth, lower, upper);
          }

        };

        // p.mousePressed = () => {
        //   let ind = getMouseLabel(p.mouseX, p.mouseY);
        //   if (ind!=-1) {
        //     ts_key = xlabels[ind];
        //   }
        //   return false
        // };

        function getMouseLabel(x,y) { // given a mouse location, return the area it is in
          for (let t=0; t<5; t++) {
            let x_upper = vert_x+graphWidth*(1/xlabels.length*(t+1));
            let x_lower = vert_x+graphWidth*(1/xlabels.length*(t));
            let y_upper = vert_y2+30;
            let y_lower = vert_y1+40;
            if (x >= x_lower && x <= x_upper && y >= y_lower && y <= y_upper) {
              return t;
            }
          }
          // if the position isn't in the boxes
          return -1;
        };

        function drawTimeSeries(p5, ts, xOffset, size, lowerbound, upperbound) {
          p5.beginShape();
          for (let i = 0; i < size && i < ts.length; i++) {
            p5.vertex((xOffset - i), p5.map(ts[ts.length - i - 1], 0, 1, lowerbound, upperbound));
          }
          p5.endShape(); 
        }

    };

   return (
        <P5Wrapper sketch={Sketch} params={value}/>
    )
};

export default PowerBars;