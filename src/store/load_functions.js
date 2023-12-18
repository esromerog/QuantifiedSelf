import visualsRaw from "../metadata/vis";

// Function to retrieve the parameters from local storage
function getParams() {
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
  return params;
}

// Function to load metadata (mappings) of the parameters
export function loadMeta() {
  const params = getParams();
  const pathname = window.location.pathname.split("/")[2]?.replace(/%20/g, " ");
  const storedMetaData = sessionStorage.getItem(`paramsMeta/${pathname}`);

  if (storedMetaData) {
    return JSON.parse(storedMetaData);
  }

  return params
    ? params.reduce((acc, curr) => {
        acc[curr.name] = {
          mapping: "Manual",
          range: [0, 1],
        };
        return acc;
      }, {})
    : {};
}

// Function to load the parameters and deal with the undefined case
export function loadParameters() {
  const params = getParams();
  if (params != undefined) {
    return params.reduce((acc, curr) => {
      acc[curr.name] = 0;
      return acc;
    }, {});
  } else {
    return {};
  }
}

// This function loads the parameters and metadata as
// the user switches in the visualization
export function loadParamsRuntime(state, action) {
  let pathname = window.location.pathname;
  pathname = pathname.split("/")[2]?.replace(/%20/g, " ");
  const storedMappings = sessionStorage.getItem(`paramsMeta/${pathname}`);
  let params = {};
  const selection = action.payload;
  let meta = {};
  
  // Check for stored mappings in the session storage and return early
  if (storedMappings != null) {
    const maps = JSON.parse(storedMappings);
    params = Object.keys(maps).reduce((acc, parameter) => {
      acc[parameter] = 0;
      return acc;
    }, {});
    meta = maps;
    return { params, meta };
  }

  // Find the parameters in the visualization's metadata and load them to the store
  params = selection.properties.reduce((acc, parameter) => {
    acc[parameter.name] = parameter.value;
    return acc;
  }, {});

  // Declare the mappings based on the visualization's metadata
  meta = selection.properties.reduce((acc, parameter) => {
    let sharedKey;
    let foundDevice;
    // Check if there is a default value to map it automatically
    if ("default" in parameter) {
      for (let device in state.dataStream) {
        const dataKeys = Object.keys(state.dataStream[device]);
        sharedKey = dataKeys.find((key) => parameter.default.includes(key));
        if (sharedKey != undefined) {
          foundDevice = device;
          break;
        }
      }
      // Map it to the stream in case there was a value found
      acc[parameter.name] = {
        mapping: foundDevice ? [foundDevice, sharedKey] : "Manual",
        range: [0, 1],
      };
    } else {
      // If there's no default value, declare manual mapping
      acc[parameter.name] = {
        mapping: "Manual",
        range: [0, 1],
      };
    }
    return acc;
  }, {});
  
  return { meta, params };
}
