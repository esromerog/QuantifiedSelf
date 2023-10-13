# Creative Representation of the Quantified Self
This project aims to promote data literacy through the creative representation of the Quantified Self. It's meant to serve as a learning resource for students seeking to understand, play around, collect and visualize their physiological signals. The project uses P5.js as the basis for the creative visualizations. In the code base, you will also find a React implementation of [three-js](https://github.com/mrdoob/three.js) and [Shaderpark](https://github.com/shader-park/shader-park-docs).

## Devices
This is a simple web app built using React and Node.js. It leverages multiple frameworks for working with different devices and being able to process their data within JavaScript. The implementation of future devices is being explored through LSL.

### Muse 2
EEG sensing headband. The application interfaces with the Muse using the Chrome's Bluetooth API thanks to the [muse-js](https://github.com/urish/muse-js) module.

### EMOTIV
A variety of wireless EEG headsets. EMOTIV provides access to derived EEG metrics using their launcher and the [Cortex API](https://github.com/Emotiv/cortex-example). Raw EEG metrics require a paid license in the EMOTIV launcher. Currently, the API keys and the license information can be specified in your own .env file.

## Installing and running the App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
