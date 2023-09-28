import { configureStore } from "@reduxjs/toolkit";
import { createStore, applyMiddleware, compose} from "redux";
import devicesRaw from './metadata/devices'

const initialState = {
    params: {},
    dataStream: {},
    deviceMeta: {},
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
            // Logic to handle initializing parameters
            return {...state,
                params: action.payload,
            }

        case 'devices/create':
            // Logic to handle creation of a new device
            return {...state,
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
            // This logic is especially useful in device that may disconnect like the emotiv
            // It is also useful for handling pre-recorded files

            return {...state,
                deviceMeta: {
                    ...state.deviceMeta,
                    [action.payload.id]: {
                        ...state.deviceMeta[action.payload.id],
                        [action.payload.field]: action.payload.data
                    }
                }
            }

        case 'devices/updateMappings':
            // Track the parameters to which a device is mapped and update them

        case 'devices/streamUpdate':
            // Logic to handle device stream updates

            return {...state,
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