import { configureStore } from "@reduxjs/toolkit";
import { createStore } from "redux";
import devicesRaw from './metadata/devices'

const initialState = {
    deviceStates: devicesRaw.reduce((acc, obj) => {
        const deviceName = obj.heading;
        acc[deviceName] = false;
        return acc
      }, {}),
    params: {},
    deviceStream: {},
    visMetadata: {},
};

// React Redux Store to manage the data that moves throghout the entire app
function rootReducer(state=initialState, action) {
    switch(action.type) {
        case 'params/update':
            // Logic to handle parameter updates
            const newData={...state.params}
            const name1=action.payload.name1;
            const name2=action.payload.name2;
            const newValue=action.payload.newValue;
            (name1 === name2) ? newData[name1] = newValue : newData[name1][name2] = newValue;
            return {...state,
                params: newData
            }
        case 'params/set':
            // Logic to handle parameter updates
            return {...state,
                params: action.payload.params,
                visMetadata: action.payload.visMetadata
            }

        case 'devices/statesUpdate':
            // Logic to handle device states updates
            const newDevices={...state.deviceStates}
            newDevices[action.payload]=!newDevices[action.payload];
            return {...state,
                deviceStates: newDevices
            }

        case 'devices/streamUpdate':
            // Logic to handle device stream updates

            return {...state,
                deviceStream: {
                    ...state.deviceStream,
                    [action.payload.device]: action.payload.data
                }
            }
        default:
            return state
    }
}

// const store = configureStore({reducer: rootReducer});
const store = createStore(rootReducer);

export default store;