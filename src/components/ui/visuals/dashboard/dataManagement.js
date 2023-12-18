import React, { useState, useEffect, useRef } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { DataManualSlider, DataAutoSlider } from "./sliders";
import { ParameterDropDown } from "./dropDown";

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

function ParameterManager({ parameter, dataMappings }) {
  // Manages if parameters are managed manually or automatically
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

  // Represents an individual parameter
  const [expanded, setExpanded] = useState(false); // Used for styling, checks to see if accordion is collapsed or not

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
            <div className="mt-1 mb-1">
              <ParameterDropDown
                claves={claves}
                parameter={visParameter}
                dataMappings={dataMappings}
              />
            </div>
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
          <ul className="list-group list-group-flush">
            <ParameterManager
              claves={claves}
              parameter={visParameter}
              dataMappings={dataMappings}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}


export default function DataManagement({ setVisInfo, visInfo, custom }) {
  // Contains the entire accordion with all vis properties based on the current visInfo

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
