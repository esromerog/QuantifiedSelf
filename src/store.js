import { configureStore } from "@reduxjs/toolkit";
import { createStore, applyMiddleware, compose } from "redux";
import devicesRaw from './metadata/devices'
import visualsRaw from './metadata/vis'



const storedMappings = sessionStorage.getItem("dataMappings");

const initialState = {
    params: {},
    dataStream: {},
    deviceMeta: {},
};

// React Redux Store to manage the data that moves throghout the entire app
function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'params/update':
            // Logic to handle parameter updates
            const newData = { ...state.params }
            const name = action.payload.name;
            const newValue = action.payload.newValue;
            newData[name] = newValue;
            return {
                ...state,
                params: newData
            }


        case 'params/load':
            const storedMappings = sessionStorage.getItem("dataMappings");
            let params = {};
            const selection = action.payload

            if (storedMappings !== null && selection.name in JSON.parse(storedMappings)) {
                const maps = JSON.parse(storedMappings)
                params = Object.keys(maps[selection.name]).reduce((acc, parameter) => {
                    acc[parameter] = 0;
                    return acc;
                }, {})
            } else {
                params = selection.properties.reduce((acc, parameter) => {
                    acc[parameter.name] = parameter.value;
                    return acc;
                }, {});
            }
            // Logic to handle initializing parameters
            return {
                ...state,
                params: params
            }

        case 'devices/create':
            // Logic to handle creation of a new device
            return {
                ...state,
                deviceMeta: {
                    ...state.deviceMeta,
                    [action.payload.id]: action.payload.metadata
                },
                dataStream: {
                    ...state.dataStream,
                    [action.payload.id]: {}
                }
            }


        case 'devices/updateMetadata':
            // This logic is especially useful in a device that may disconnect like the emotiv
            // It is also useful for handling pre-recorded files

            return {
                ...state,
                deviceMeta: {
                    ...state.deviceMeta,
                    [action.payload.id]: {
                        ...state.deviceMeta[action.payload.id],
                        [action.payload.field]: action.payload.data
                    }
                }
            }


        case 'devices/streamUpdate':
            // Logic to handle device stream updates

            return {
                ...state,
                dataStream: {
                    ...state.dataStream,
                    [action.payload.id]: action.payload.data
                }
            }
        default:
            return state
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = configureStore({reducer: rootReducer});
const store = createStore(rootReducer, composeEnhancers(applyMiddleware()));

export default store;