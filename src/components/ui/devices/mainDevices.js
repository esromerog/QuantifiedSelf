import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";

import RenderDevices from "./devicesTab";

import DataManagement from "../visuals/dashboard/dataManagement";
import { Link, useParams } from "react-router-dom";
import { FileUploader } from "./stream_functions/file_upload";
import { createSelector } from "reselect";
import { DeviceConnection } from "./stream_functions/connection_modal";

const selectData = (state) => state.dataStream;
const selectDeviceMeta = (state) => state.deviceMeta;

const getDataIDs = createSelector([selectDeviceMeta], (deviceMeta) => {
  return Object.keys(deviceMeta).filter((name) =>
    deviceMeta[name]?.id?.includes("EPOC")
  );
});

export const selectDevices = createSelector(
  [selectData, selectDeviceMeta],
  (dataStream, deviceMeta) => {
    const ids = Object.keys(dataStream);
    const devices = ids.map((id) => deviceMeta[id]?.device);
    return devices.filter(Boolean);
  }
);

export function DeviceSelectionWindow() {
  const [modalDevice, setModalDevice] = useState(<></>);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setModalDevice(<></>)
  };

  function handleShow(device) {
    const deviceModals = (name) =>
      name === "Upload" ? (
        <FileUploader show={show} handleClose={handleClose} />
      ) : (
        <DeviceConnection
          show={show}
          handleClose={handleClose}
          deviceName={name}
        />
      );
    setModalDevice(deviceModals(device));
  }

  useEffect(()=>{
    setShow(!show);
  }, [modalDevice])

  // Check if you have more than two EPOC or EPOC+ headsets. If you do, the connectivity option becomes available
  const emotivIDs = useSelector(getDataIDs);
  let showConn = false;
  if (emotivIDs.length > 1) {
    showConn = true;
  }

  const [pressingAlt, setPressingAlt] = useState(false);

  window.addEventListener("keydown", (e) => {
    if (e.altKey) {
      setPressingAlt(true);
    }
  });
  window.addEventListener("keyup", (e) => {
    if (!e.altKey) {
      setPressingAlt(false);
    }
  });

  return (
    <div className="center-margin text-center align-items-center">
      <h4 className="mt-5 mb-2">Data Sources</h4>
      <p className="center-margin" style={{ overflowWrap: "nowrap" }}>
        Here you can connect to different devices, manage them, and upload files
        from previous recordings.
      </p>
      <div className="ms-5 me-5">
        <RenderDevices />
        <div className="d-flex justify-content-center">
          <div className="dropdown-center">
            <a
              className="btn btn-link"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-plus-circle h5"></i>
            </a>
            <ul className="dropdown-menu">
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleShow("EMOTIV")}
                >
                  EMOTIV
                </a>
              </li>
              <li>
                <a className="dropdown-item" onClick={() => handleShow("Muse")}>
                  Muse
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleShow("Face")}
                >
                  Face Landmarks
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleShow("VideoHeartRate")}
                >
                  Video Heart Rate
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleShow("Upload")}
                >
                  Upload a file
                </a>
              </li>
              {pressingAlt ? (
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => handleShow("LSL")}
                  >
                    LSL Stream
                  </a>
                </li>
              ) : null}
              {showConn ? (
                <li>
                  <a className="dropdown-item" onClick={() => handleShow("")}>
                    Hyperscanning
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          {modalDevice}
        </div>
      </div>
    </div>
  );
}

export function DataManagementWindow() {
  const { visID } = useParams();

  const mainMenu = visID === "home" ? true : false;

  return (
    <div>
      <div className="d-flex align-items-center">
        <Link className="btn btn-link ps-0 pt-0 pb-0" to="../devices">
          <i className="bi bi-chevron-left m-0" alt="Back to devices"></i>
        </Link>
        <h5 className="m-0">Data Management</h5>
      </div>
      <p className="mb-2 mt-2">
        Tune the parameters of the visualization! If there is a stream of data,
        you'll be able to map the parameters to the stream
      </p>
      {!mainMenu ? <DataManagement /> : null}
    </div>
  );
}
