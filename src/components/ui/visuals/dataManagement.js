import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import { useSelector, useDispatch } from "react-redux";
import { allVisSources } from "../../../App";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";

const selectStream = (state) => state.dataStream;

const getDataStreamKeys = createSelector([selectStream], (dataStreamObject) => {
  const returnItems = [];
  for (const valor in dataStreamObject) {
    let newObj = {};
    newObj["device"] = valor;
    newObj["data"] = [];
    for (const datos in dataStreamObject[valor]) {
      newObj["data"] = [...newObj["data"], datos];
    }
    returnItems.push(newObj);
  }
  return returnItems;
});

const selectDataMappings = createSelector(
  [(state) => state.paramsMeta],
  (metadata) => {
    return Object.keys(metadata).reduce((acc, curr) => {
      acc[curr] = metadata[curr]["mapping"];
      return acc;
    }, {});
  }
);

function DataManualSlider({ parameter }) {
  // This function is the list item when it is connected not connected to a datastream
  // It contains the logic to handle changing into manual mode, setting auto-range, and setting the value of the parameter, to the stream value.

  let valor;

  // I can rework this to use the store state.params initial state/default values.
  // May also loop through the visParameters JSON using the keys of the state.params object

  const params = useSelector((state) => state.params);

  try {
    valor = params[parameter];
  } catch {
    valor = 0;
  }

  const dispatch = useDispatch();

  // Defines min and max of slider
  const min = 0;
  const max = 1;

  // Handles updating the values of the slider
  // This is what must be replaced with the action

  const handleInputChange = (e) => {
    dispatch({
      type: "params/update",
      payload: {
        name: parameter,
        newValue: e.target.value,
      },
    });
  };

  // Handles changing the values of the input
  const handleFormChange = (e) => {
    e.preventDefault();
    let formValue = e.target.value;
    if (formValue > max) {
      formValue = max;
    } else if (formValue < min) {
      formValue = min;
    }
    dispatch({
      type: "params/update",
      payload: {
        name: parameter,
        newValue: formValue,
      },
    });
    e.target.value = formValue;
  };

  return (
    <div className="row justify-content-start">
      <div className="col-xxl-5 col-xl-4 col-lg-5">
        <div className="input-group">
          <form className="form-floating" autoComplete="off">
            <input
              type="text"
              className="form-control"
              id="valorManualInput"
              value={Math.round(valor * 1000) / 1000 || 0}
              onChange={handleFormChange}
            />
            <label htmlFor="valorManualInput">Value</label>
          </form>
        </div>
      </div>
      <div className="col-xxl-7 col-xl-8 col-lg-7 align-self-center">
        <input
          type="range"
          className="form-range align-self-center"
          onChange={handleInputChange}
          id="customRange1"
          autoComplete="off"
          value={valor || 0}
          step={0.01}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
}

function DataAutoSlider({ dataMappings, parameter }) {
  // This function is the list item when it is connected to a data stream.
  // It contains the logic to handle changing into manual mode, setting auto-range, and setting the value of the parameter, to the stream value.

  const range = useSelector((state) => state.paramsMeta[parameter]["range"]);

  const dispatch = useDispatch();
  const stream = useSelector(selectStream);

  // Defines which dataSource is selected
  const select = dataMappings[parameter];

  // This will use the react store with dataStream
  let source; // Extracts the value from that dataSource

  // Logic that fetches the data from the device stream based on your selection in the dropdown
  try {
    source = stream[select[0]][select[1]];
  } catch (error) {
    source = 0;
  }

  // Min & Max values.
  const [min, setMin] = useState(range[0]); // Actual values used by the mapping
  const [max, setMax] = useState(range[1]);
  const [formMin, setFormMin] = useState(range[0]); // Values to be shown when the user edits the form
  const [formMax, setFormMax] = useState(range[1]);

  const [disabled, setDisabled] = useState(false); // Defines if items are disabled (ex, when autoranging)

  function looseFocusMin() {
    // Function to change the min value. Contains logic in case it doesn't follow rules.
    const valor = parseFloat(formMin);
    if (isNaN(valor)) {
      setFormMin(min);
      return;
    }
    if (valor > max) {
      setFormMin(parseFloat(max) - 1);
      return;
    }
    if (valor === max) {
      setFormMin(parseFloat(max) - 1);
      return;
    }
    setMin(formMin);
    dispatch({
      type: "params/updateRange",
      payload: {
        parameter: parameter,
        range: [min, max],
      },
    });
  }

  function looseFocusMax() {
    // Function to change the max value. Contains logic in case it doesn't follow rules.
    const valor = parseFloat(formMax);
    if (isNaN(valor)) {
      setFormMax(max);
      return;
    }
    if (valor < min) {
      setFormMax(parseFloat(min) + 1);
      return;
    }
    if (valor === min) {
      setFormMax(parseFloat(min) + 1);
      return;
    }
    setMax(parseFloat(formMax));
    dispatch({
      type: "params/updateRange",
      payload: {
        parameter: parameter,
        range: [min, max],
      },
    });
  }

  const [buffer, setBuffer] = useState([false]); // Data buffer for autorange

  // Gets called once autorange starts
  async function handleAutoSet() {
    setBuffer([]);
    setDisabled(true);
  }

  useEffect(() => {
    // Actual autorange function.
    if (typeof buffer[0] !== "boolean") {
      const buff = [...buffer, source];
      setBuffer(buff);
    }
    if (buffer.length > 20) {
      setBuffer([false]);

      setDisabled(false);

      const minimo = Math.min(...buffer);
      setMin(minimo);
      setFormMin(minimo);

      const maximo = Math.max(...buffer);
      setMax(maximo);
      setFormMax(maximo);

      dispatch({
        type: "params/updateRange",
        payload: {
          parameter: parameter,
          range: [minimo, maximo],
        },
      });
    }
  }, [source]);

  /// function to change the form value
  const formMinChange = useCallback((e) => {
    e.preventDefault();
    setFormMin(e.target.value);
  }, []);
  const formMaxChange = useCallback((e) => {
    e.preventDefault();
    setFormMax(e.target.value);
  }, []);

  const rangeToolTip = (
    <Popover id="popover-basic">
      <Popover.Header as="h5">Range</Popover.Header>
      <Popover.Body>
        <div className="input-group">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              inputMode="decimal"
              id="max"
              value={formMin}
              onBlur={looseFocusMin}
              readOnly={disabled}
              disabled={disabled}
              onChange={formMinChange}
            />
            <label htmlFor="max">Min</label>
          </div>
          <div className="form-floating">
            <input
              type="text"
              autoComplete="off"
              className="form-control"
              id="max"
              value={formMax}
              onBlur={looseFocusMax}
              readOnly={disabled}
              disabled={disabled}
              onChange={formMaxChange}
            />
            <label htmlFor="max">Max</label>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAutoSet}
            disabled={disabled}
          >
            Auto
          </button>
        </div>
      </Popover.Body>
    </Popover>
  );

  const [rangeTrigger, setRangeTrigger] = useState(false);

  return (
    <div className="row justify-content-start">
      <div className="col-4">
        <div className="input-group">
          <form className="form-floating" autoComplete="off">
            <input
              type="text"
              className="form-control"
              id="valueAutoInput"
              value={Math.round(source * 1000) / 1000}
              disabled
            ></input>
            <label htmlFor="valueAutoInput">Value</label>
          </form>
        </div>
      </div>
      <div className="col-6 align-self-center">
        <OverlayTrigger
          trigger="click"
          placement="right"
          rootClose
          overlay={rangeToolTip}
        >
          <button
            className={
              !rangeTrigger
                ? "btn btn-sm btn-outline-primary"
                : "btn btn-sm btn-primary"
            }
            onClick={() => setRangeTrigger(!rangeTrigger)}
          >
            Range
          </button>
        </OverlayTrigger>
      </div>
    </div>
  );
}

function ParameterDropDown({ claves, parameter, dataMappings }) {
  const [show, setShow] = useState(true);

  // Display text on the card. Upon creation, it checks the status
  const [display, setDisplay] = useState(() => {
    let disp = dataMappings[parameter.name];
    if (disp === "Manual") disp = "Manual";
    else disp = disp[1];
    return disp;
  });

  let { visID } = useParams();
  const dispatch = useDispatch();

  function checkDefault(data) {
    const currVisProperties = allVisSources.find(({ id }) => id === visID);
    const currParam = currVisProperties?.properties?.find(
      ({ name }) => name === parameter.name
    );
    return currParam?.default?.includes(data) || false;
  }

  // Changes the data source
  function selectNewSource(sourceName) {
    dispatch({
      type: "params/updateMappings",
      payload: {
        parameter: parameter.name,
        stream: sourceName,
        vis: visID,
      },
    });

    // Changes the display text when the data source/dataMappings change
    let disp = sourceName;

    if (sourceName === "Manual") setDisplay("Manual");
    else setDisplay(disp[1]);
    setShow(false);
  }

  function sortWithDefault(option, dataStream) {
    const { hasDefault, notHasDefault } = dataStream.reduce(
      (acc, element) => {
        const isDefault = checkDefault(element);
        acc[isDefault ? "hasDefault" : "notHasDefault"].push(element);
        return acc;
      },
      { hasDefault: [], notHasDefault: [] }
    );

    return (
      <ul className="submenu dropdown-menu" id="nested-dropdown">
        {hasDefault.length > 0 && (
          <small className="dropdown-item disabled">Suggested Mappings</small>
        )}
        {hasDefault.map((data) => (
          <li key={data}>
            <button
              className={`dropdown-item ${data === display && "text-primary"}`}
              onClick={() => selectNewSource([option.device, data])}
            >
              {data}
            </button>
          </li>
        ))}
        {hasDefault.length > 0 && (
          <small className="dropdown-item disabled">All Streams</small>
        )}
        {notHasDefault.map((data) => (
          <li key={data}>
            <button
              className={`dropdown-item ${data === display && "text-primary"}`}
              onClick={() => selectNewSource([option.device, data])}
            >
              {data}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  // Changes the color of the button as dataMappings changes
  const dispColor = useMemo(
    () =>
      display.includes("Manual")
        ? "btn btn-mapping ms-2 rounded-0"
        : "btn btn-mapping ms-2 rounded-0",
    [dataMappings]
  );

  console.log("Re-render");
  return (
    <div>
      <button
        type="button"
        className={dispColor}
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
        onMouseEnter={() => setShow(true)}
      >
        Mapping - {display}
      </button>
      <ul className={`dropdown-menu ${show ? "visible" : "hidden"}`}>
        <li>
          <button
            className={`dropdown-item ${
              display === "Manual" && "text-primary"
            }`}
            onClick={() => selectNewSource("Manual")}
          >
            Manual
          </button>
        </li>
        {claves.map((option) => {
          return (
            <li key={option.device}>
              <button
                type="button"
                className="dropdown-item"
                data-bs-toggle="dropdown-submenu"
                data-bs-target="#nested-dropdown"
                aria-expanded="false"
              >
                {option.device}
              </button>
              {sortWithDefault(option, option.data)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ParameterManager({ parameter, dataMappings }) {
  const manual = dataMappings[parameter.name] === "Manual";

  return (
    <li className="list-group-item mb-2 container" key={parameter.name}>
      {manual ? (
        <DataManualSlider parameter={parameter.name} />
      ) : (
        <DataAutoSlider
          parameter={parameter.name}
          dataMappings={dataMappings}
        />
      )}
    </li>
  );
}

function DataCard({
  visParameter,
  dataMappings,
  custom,
  deleteParameter,
  claves,
}) {
  // claves is the object returned from the getDataStreamKeys that provides the devices & their streams as a list

  // Generates the drop-downs that provide a slider and range functions
  const mapeo = () => {
    return (
      <ParameterManager
        claves={claves}
        parameter={visParameter}
        dataMappings={dataMappings}
      />
    );
  };

  const [expanded, setExpanded] = React.useState(false); // Used for styling, checks to see if accordion is collapsed or not

  // This is the external drop-down that is shown on the actual card when collapsed. Create and declare the dropDown menu that contains data mappings.
  // The difference here is that it will be a mapping in case there are subparametes & it isn't updated as often
  const [dropDown, setDropDown] = useState()
  
  useEffect(
    () => (
      setDropDown(<div className="mt-1 mb-1">
        <ParameterDropDown
          claves={claves}
          parameter={visParameter}
          dataMappings={dataMappings}
        />
      </div>)
    ),
    [claves]
  );

  return (
    <div className="list-group-item" key={visParameter.name}>
      <div
        className="d-flex align-items-center pt-1 pb-1"
        key={visParameter.name}
      >
        {custom ? (
          <button
            className="btn btn-link text-center p-0 me-2 ms-n1 delete-btn"
            onClick={() => {
              deleteParameter(visParameter.name);
            }}
          >
            <i className="h5 p-0 bi bi-dash text-danger"></i>
          </button>
        ) : null}
        <div>{visParameter.name}</div>
        <div className="btn-map-transition closed col align-items-right">
          <div className="d-flex justify-content-end align-items-center text-center flex-wrap">
            {dropDown}
          </div>
        </div>
        <button
          className={
            expanded
              ? "btn btn-link fa-arrow-down open"
              : "btn btn-link fa-arrow-down close"
          }
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#" + visParameter.name.replace(" ", "_")}
          aria-expanded="false"
          aria-controls="collapseTwo"
          onClick={() => setExpanded(!expanded)}
        >
          <i className="bi bi-three-dots-vertical"></i>
        </button>
      </div>
      <div id={visParameter.name.replace(" ", "_")} className="collapse">
        <div>
          <ul className="list-group list-group-flush">{mapeo()}</ul>
        </div>
      </div>
    </div>
  );
}

export default function DataManagement({ setVisInfo, visInfo, custom }) {
  // Some input props:
  //    activeVisParameters - object that defines the parameters that are being changed by the data stream
  //    visInfo -  the object that contains the selected visualization's metadata
  //    dataStreamObject - contains the data stream in the shape: {Device1: {Metric1: int, Metric2: int}, Device2: ...}

  // dataMappings is an array that contains the parameters of the visualization and describes what they are mapped to:
  //      It has the shape: {Param1: Device Name/Manual}

  const dispatch = useDispatch();
  const [newParamName, setNewParamName] = useState("");
  const [valid, setValid] = useState(true);

  const dataMappings = useSelector(selectDataMappings);
  // Generates the cards with the parameters

  const claves = useSelector(getDataStreamKeys);

  const dataCards = visInfo?.properties?.map((parameter) => (
    <DataCard
      visParameter={parameter}
      key={parameter.name}
      dataMappings={dataMappings}
      deleteParameter={deleteParameter}
      custom={custom}
      claves={claves}
    />
  ));

  function deleteParameter(paramName) {
    // Retrieve data from local storage and assign it to a new object
    const prevData = JSON.parse(localStorage.getItem("visuals"));
    const newMeta = JSON.parse(JSON.stringify(visInfo));
    newMeta.properties = newMeta.properties.filter(
      ({ name }) => name != paramName
    );

    let newData = [];
    // Get the previous data and remove the old properties from it
    if (prevData != undefined) {
      newData = prevData.filter(({ id }) => id !== visInfo.id);
    }

    newData.push(newMeta); // Push the new vis into it
    // Set that new vis into the localStorage
    localStorage.setItem("visuals", JSON.stringify(newData));

    dispatch({
      type: "params/delete",
      payload: {
        parameter: paramName,
      },
    });
    setVisInfo(newMeta);
  }

  function newParameter() {
    const newText = newParamName;
    //const utf8Data = newText.replace(/[^\x20-\x7E]+/g, '');
    const utf8Data = newText;

    const currentProperties = visInfo.properties.map(({ name }) => name);
    if (currentProperties.includes(utf8Data)) {
      setValid(false);
      return;
    }

    if (utf8Data == "") {
      setValid(false);
      return;
    }

    // Retrieve data from local storage and assign it to a new object
    const prevData = JSON.parse(localStorage.getItem("visuals"));
    const newMeta = JSON.parse(JSON.stringify(visInfo));
    newMeta.properties.push({ name: utf8Data, value: 0 });

    let newData = [];
    // Get the previous data and remove the old properties from it
    if (prevData != undefined) {
      newData = prevData.filter(({ id }) => id !== visInfo.id);
    }

    newData.push(newMeta); // Push the new vis into it
    // Set that new vis into the localStorage
    localStorage.setItem("visuals", JSON.stringify(newData));

    dispatch({
      type: "params/create",
      payload: {
        parameter: utf8Data,
      },
    });
    setVisInfo(newMeta);
    setShow(false);
  }

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShow(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const overlayRef = useRef(null);

  useOutsideAlerter(overlayRef);
  const [show, setShow] = useState(false);

  const newParamToolTip = (
    <Popover id="popover-basic">
      <Popover.Header as="h5">Create a new parameter</Popover.Header>
      <Popover.Body>
        <div className="input-group" ref={overlayRef}>
          <form className="form-floating" autoComplete="off">
            <input
              type="text"
              className={`form-control ${valid ? "" : "is-invalid"}`}
              autoComplete="off"
              id="max"
              value={newParamName}
              onChange={(e) => {
                setNewParamName(e.target.value);
                setValid(true);
              }}
            />
            <label htmlFor="max">Name</label>
          </form>
          <button className="btn btn-primary" onClick={newParameter}>
            Create
          </button>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="mb-5">
      <div className="list-group rounded-0">{dataCards}</div>
      {custom ? (
        <div className="d-flex justify-content-center text-center">
          <OverlayTrigger
            trigger="click"
            placement="top"
            rootClose
            overlay={newParamToolTip}
            show={show}
          >
            <button
              className="btn btn-link"
              type="button"
              aria-expanded="false"
              onClick={() => setShow(!show)}
            >
              <i className="bi bi-plus-circle h5"></i>
            </button>
          </OverlayTrigger>
        </div>
      ) : null}
    </div>
  );
}
