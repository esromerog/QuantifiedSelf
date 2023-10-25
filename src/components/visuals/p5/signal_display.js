const signal_display = `

// helper function
function drawTimeSeries(p5_instance, ts, xOffset, lowerbound, upperbound) {
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
            drawTimeSeries(p, ts_channels[k], canvasRef.current.offsetWidth, k * canvasRef.current.offsetHeight / chn, (k + 1) * canvasRef.current.offsetHeight / chn);
        }
    }
};`

export default signal_display;