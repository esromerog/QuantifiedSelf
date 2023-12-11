import { configureStore } from "@reduxjs/toolkit";
import { createStore, applyMiddleware, compose } from "redux";
import devicesRaw from "./metadata/devices";
import visualsRaw from "./metadata/vis";
import { useParams } from "react-router-dom";
import { AccessorNodeDependencies } from "mathjs";

let pathname = window.location.pathname;
pathname = pathname.split("/")[2]?.replace(/%20/g, " ");
let params = visualsRaw.find(({ id }) => id == pathname)?.properties;

if (params == undefined) {
  const visMeta = localStorage.getItem("visuals");
  if (visMeta != null) {
    const localData = JSON.parse(visMeta).find(({ id }) => id == pathname);
    if (localData != null) {
      params = localData.properties;
    }
  }
}

const loadMeta = () => {
  const storedMetaData = sessionStorage.getItem(`paramsMeta/${pathname}`);
  if (storedMetaData != null) {
    return JSON.parse(storedMetaData);
  } else if (params != undefined) {
    return params.reduce((acc, curr) => {
      acc[curr.name] = {
        mapping: "Manual",
        range: [0, 1],
      };
      return acc;
    }, {});
  } else {
    return {};
  }
};

const loadParameters = () => {
  if (params != undefined) {
    return params.reduce((acc, curr) => {
      acc[curr.name] = 0;
      return acc;
    }, {});
  } else {
    return {};
  }
};

function normalizeValue(value, min, max) {

  // Map the value to the range 0 to 1
  return (value - min) / (max - min);
}

const initialState = {
  params: loadParameters(),
  dataStream: {},
  deviceMeta: {},
  paramsMeta: loadMeta(),
};

// React Redux Store to manage the data that moves throghout the entire app
function rootReducer(state = initialState, action) {
  function updateWithLocalStorage(mode) {
    const prevMappings = JSON.parse(sessionStorage.getItem("paramsMeta"));

    const { parameter } = action.payload;

    const newState = { ...state };
    newState.paramsMeta = { ...state.paramsMeta };

    if (mode === "delete") {
      delete newState.paramsMeta[parameter];
    } else {
      newState.paramsMeta[parameter] = {
        ...newState.paramsMeta[parameter],
        ...(mode === "create" ? { range: [0, 1], mapping: "Manual" } : {}),
        ...(mode === "update" ? { mapping: action.payload.stream } : {}),
        ...(mode === "range" ? { range: action.payload.range } : {}),
      };
    }

    const mapsToSave = {
      ...prevMappings,
      [action.payload.vis]: newState.paramsMeta,
    };

    sessionStorage.setItem("paramsMeta", JSON.stringify(mapsToSave));
    return newState;
  }

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
      const storedMappings = sessionStorage.getItem(`paramsMeta/${pathname}`);
      let params = {};
      const selection = action.payload;
      let meta = {};

      if (storedMappings != null) {
        const maps = JSON.parse(storedMappings);
        params = Object.keys(maps).reduce((acc, parameter) => {
          acc[parameter] = 0;
          return acc;
        }, {});
        meta = maps;
      } else {
        params = selection.properties.reduce((acc, parameter) => {
          acc[parameter.name] = parameter.value;
          return acc;
        }, {});
        meta = selection.properties.reduce((acc, parameter) => {
          let sharedKey;
          let foundDevice;
          if ("default" in parameter) {
            for (let device in state.dataStream) {
              const dataKeys = Object.keys(state.dataStream[device]);
              sharedKey = dataKeys.find((key) =>
                parameter.default.includes(key)
              );
              if (sharedKey != undefined) {
                foundDevice = device;
                break;
              }
            }
            if (foundDevice) {
              acc[parameter.name] = {
                mapping: [foundDevice, sharedKey],
                range: [0, 1],
              };
            } else {
              acc[parameter.name] = {
                mapping: "Manual",
                range: [0, 1],
              };
            }
          } else {
            acc[parameter.name] = {
              mapping: "Manual",
              range: [0, 1],
            };
          }
          return acc;
        }, {});
      }

      // Logic to handle initializing parameters
      return {
        ...state,
        params: params,
        paramsMeta: meta,
      };

    case "params/updateMappings":
      return updateWithLocalStorage("update");

    case "params/create":
      return updateWithLocalStorage("create");

    case "params/updateRange":
      return updateWithLocalStorage("range");

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
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = configureStore({reducer: rootReducer});
const store = createStore(rootReducer, composeEnhancers(applyMiddleware()));

export default store;
