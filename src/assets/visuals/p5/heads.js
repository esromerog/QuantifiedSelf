const heads = `
// Initial variable declaration
let imgLeft;
let touching = false;
let total_score = 0;
let startTime;
let score = 0;

// Load the images
p.preload = () => {
    imgLeft = p.loadImage("/head.png");
}

// This code only runs once and sets up your project
p.setup = () => {
    // This line is important so that it takes up the size of your window.
    p.createCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
}

// Code that is constantly being updated
p.draw = () => {
    // Sets your background color to black using RGB values
    p.background(0, 0, 0);

    // Calculate the image size and maximum distance based on the canvas
    var max_distance = p.width/4;
    const ratio = imgLeft.width/imgLeft.height;
    const newWidth = p.width/2 - max_distance;
    const newHeight = newWidth/ratio;
    const center = p.width/2-newWidth/2;

    // Logic to calculate the distance between the pictures based on the value
    const distance = p.map(value.current["Distance"], 0, 1, 0, max_distance);

    // Logic to calculate the scores
    // The value of distance in this case is reversed (higher distance is closer)
    // This accounts for how higher synchrony values indicate closeness.
    if (value.current["Distance"]>0.9) {
        if (!touching) {
            startTime = new Date();
            touching = true;
        }
    } else {
        touching = false;
        startTime = 0;
    }
    if (touching) {
        const currTime = new Date();
        console.log(currTime - startTime);
        score = Math.round((currTime-startTime)/100);
    } else {
        total_score += score;
        score = 0;
    }
    const scoreString = 'Score: '+ (total_score + score);
    
    // Add text
    p.fill(190);
    p.textSize(25);
    p.text(scoreString, 20, 50);

    // Draw the images
    p.image(imgLeft, center-max_distance+distance, p.height/2-newWidth/2, newWidth, newHeight);
    p.scale(-1,1);
    p.image(imgLeft, -center-max_distance+distance, p.height/2-newWidth/2, -newWidth, newHeight);
}
`

export default heads;
