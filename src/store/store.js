import { configureStore } from "@reduxjs/toolkit";
import { loadParameters, loadMeta, loadParamsRuntime } from "./load_functions";
import { normalizeValue, updateWithLocalStorage } from "./utility_functions";


const initialState = {
  params: loadParameters(),
  dataStream: {},
  deviceMeta: {},
  paramsMeta: loadMeta(),
};


// React Redux Store to manage the data that moves throghout the entire app
function rootReducer(state = initialState, action) {

  switch (action.type) {
    case "params/update":
      // Logic to handle parameter updates
      const newData = { ...state.params };
      const name = action.payload.name;
      const newValue = action.payload.newValue;
      newData[name] = newValue;
      return {
        ...state,
        params: newData,
      };

    case "params/load":
      // Logic to handle initializing parameters
      const {params, meta} = loadParamsRuntime(state, action);

      return {
        ...state,
        params: params,
        paramsMeta: meta,
      };

    case "params/updateMappings":
      return updateWithLocalStorage(state, action, "update");

    case "params/create":
      return updateWithLocalStorage(state, action, "create");

    case "params/updateRange":
      return updateWithLocalStorage(state, action, "range");

    case "devices/create":
      // Logic to handle creation of a new device
      return {
        ...state,
        deviceMeta: {
          ...state.deviceMeta,
          [action.payload.id]: action.payload.metadata,
        },
        dataStream: {
          ...state.dataStream,
          [action.payload.id]: {},
        },
      };

    case "devices/updateMetadata":
      // This logic is especially useful in a device that may disconnect like the emotiv
      // It is also useful for handling pre-recorded files

      return {
        ...state,
        deviceMeta: {
          ...state.deviceMeta,
          [action.payload.id]: {
            ...state.deviceMeta[action.payload.id],
            [action.payload.field]: action.payload.data,
          },
        },
      };

    case "devices/streamUpdate":
      // Logic to handle device stream updates
      // If it's mapped to something, update the parameter
      const updatedData = { ...state.params };

      for (const item in state.paramsMeta) {
        const src = state.paramsMeta[item]["mapping"];
        const range = state.paramsMeta[item]["range"];
        if (src[0] === action.payload.id && action.payload.data[src[1]]) {
          updatedData[item] = normalizeValue(
            action.payload.data[src[1]],
            range[0],
            range[1]
          );
        }
      }
      return {
        ...state,
        dataStream: {
          ...state.dataStream,
          [action.payload.id]: {
            ...state.dataStream[action.payload.id],
            ...action.payload.data,
          },
        },
        params: updatedData,
      };

    default:
      return state;
  }
}

const store = configureStore({ reducer: rootReducer });

export default store;
