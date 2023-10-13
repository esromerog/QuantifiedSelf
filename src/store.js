import { configureStore } from "@reduxjs/toolkit";
import { createStore, applyMiddleware, compose } from "redux";
import devicesRaw from './metadata/devices'
import visualsRaw from './metadata/vis'
import { useParams } from 'react-router-dom';
import { AccessorNodeDependencies } from "mathjs";



let pathname = window.location.pathname;
pathname = pathname.split("/")[1].replace("%20", " ");
const params = visualsRaw.find(({ name }) => name === pathname)?.properties;

const loadMeta = () => {
    const storedMetaData = sessionStorage.getItem("paramsMeta");

    if (params !== undefined) {
        if (storedMetaData !== null && pathname in JSON.parse(storedMetaData)) {
            const maps = JSON.parse(storedMetaData)
            return maps[pathname];
        } else {
            return params.reduce((acc, curr) => {
                acc[curr.name] = {
                    "mapping": "Manual",
                    "range": [0, 1]
                }
                return acc
            }, {})
        }
    } else {
        return {}
    }
}

const loadParameters = () => {
    if (params !== undefined) {
        return params.reduce((acc, curr) => {
            acc[curr.name] = 0
            return acc
        }, {})
    } else {
        return {}
    }
}

function normalizeValue(value, minimum, maximum) {
    const normalizedValue = (value - minimum) / (maximum - minimum);
    return normalizedValue;
}

const initialState = {
    params: loadParameters(),
    dataStream: {},
    deviceMeta: {},
    paramsMeta: loadMeta()
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
            const storedMappings = sessionStorage.getItem("paramsMeta");
            let params = {};
            const selection = action.payload
            let meta = {};

            if (storedMappings !== null && selection.name in JSON.parse(storedMappings)) {
                const maps = JSON.parse(storedMappings)
                params = Object.keys(maps[selection.name]).reduce((acc, parameter) => {
                    acc[parameter] = 0;
                    return acc;
                }, {})
                meta = maps[selection.name];
            } else {
                params = selection.properties.reduce((acc, parameter) => {
                    acc[parameter.name] = parameter.value;
                    return acc;
                }, {});
                meta = selection.properties.reduce((acc, parameter) => {
                    if ('default' in parameter) {
                        const foundDevice = Object.keys(state.dataStream).find((obj) => parameter.default in state.dataStream[obj])
                        if (foundDevice) {
                            acc[parameter.name] = {
                                "mapping": [foundDevice, parameter.default],
                                "range": [0, 1]
                            }
                        } else {
                            acc[parameter.name] = {
                                "mapping": "Manual",
                                "range": [0, 1]
                            }
                        }
                    } else {
                        acc[parameter.name] = {
                            "mapping": "Manual",
                            "range": [0, 1]
                        }
                    }
                    return acc;
                }, {});
            }

            // Logic to handle initializing parameters
            return {
                ...state,
                params: params,
                paramsMeta: meta
            }

        case 'params/updateMappings':
            const currMappings = JSON.parse(sessionStorage.getItem("paramsMeta"));

            const newState = {
                ...state,
                paramsMeta: {
                    ...state.paramsMeta,
                    [action.payload.parameter]: {
                        ...state.paramsMeta[action.payload.parameter],
                        ["mapping"]: action.payload.stream
                    }
                }
            }

            const saveMappings = {
                ...currMappings,
                [action.payload.vis]: newState.paramsMeta
            }

            sessionStorage.setItem("paramsMeta", JSON.stringify(saveMappings));

            return newState

        case 'params/updateRange':
            const curr = JSON.parse(sessionStorage.getItem("paramsMeta"));

            const nextState = {
                ...state,
                paramsMeta: {
                    ...state.paramsMeta,
                    [action.payload.parameter]: {
                        ...state.paramsMeta[action.payload.parameter],
                        ["range"]: action.payload.range
                    }
                }
            }

            const saveState = {
                ...curr,
                [action.payload.vis]: nextState.paramsMeta
            }

            sessionStorage.setItem("paramsMeta", JSON.stringify(saveState));

            return nextState

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
            // If it's mapped to something, update the parameter
            const updatedData = { ...state.params };

            for (const item in state.paramsMeta) {
                const src = state.paramsMeta[item]["mapping"];
                const range = state.paramsMeta[item]["range"];
                if (src[0] === action.payload.id) {
                    updatedData[item] = normalizeValue(action.payload.data[src[1]], range[0], range[1]);
                }
            }

            return {
                ...state,
                dataStream: {
                    ...state.dataStream,
                    [action.payload.id]: { ...state.dataStream[action.payload.id], ...action.payload.data }
                },
                params: updatedData
            }

        default:
            return state
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = configureStore({reducer: rootReducer});
const store = createStore(rootReducer, composeEnhancers(applyMiddleware()));

export default store;

