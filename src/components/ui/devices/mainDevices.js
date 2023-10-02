import React, {useState} from 'react';
import { useSelector } from "react-redux";

import RenderDevices from "./devicesTab";

import { EmotivConnection } from './stream_functions/emotiv';

import AvailableDataInformation from "./availableData";

import DataManagement from '../visuals/dataManagement';
import { Link, useParams } from 'react-router-dom';
import { FileUploader, RecordedDataButton } from './stream_functions/file_upload';
import { createSelector } from 'reselect';

const selectData = state => state.dataStream;
const selectDeviceMeta = state => state.deviceMeta;

export const selectDevices = createSelector(
    [selectData, selectDeviceMeta],
    (dataStream, deviceMeta) => {
      const ids = Object.keys(dataStream);
      const devices = ids.map(id => deviceMeta[id]?.device);
      return devices.filter(Boolean);
    }
);

export function DeviceSelectionWindow() {
    const { visID } = useParams();

    const mainMenu = (visID === "home") ? true : false;

    const [modalDevice, setModalDevice] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false); setModalDevice("")}
    function handleShow(device) { setShow(true); setModalDevice(device)};


    const deviceModals = {
        "EMOTIV": <EmotivConnection show={show} handleClose={handleClose}/>,
        "Upload": <FileUploader show={show} handleClose={handleClose}/>
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="m-0 pb-2 pt-2">Data Sources</h5>
                {(!mainMenu) ?
                    <Link className="btn btn-link text-decoration-none" to="../data">
                        <small className="m-0 ">Data Management  </small><i className="bi bi-arrow-right" alt="Go to data management"></i>
                    </Link> : null}
            </div>
            <div>
                <RenderDevices />
                <div className='d-flex justify-content-center'>
                    <div className="dropdown-center">
                        <a className="btn btn-link" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-plus-circle h5"></i>
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#" onClick={()=>handleShow("EMOTIV")}>EMOTIV</a></li>
                            <li><a className="dropdown-item" href="#" onClick={()=>handleShow("Upload")}>Upload a file</a></li>
                        </ul>
                    </div>
                    {deviceModals[modalDevice]}
                </div>
            </div>
        </div>
    )
}

export function DataManagementWindow() {
    const { visID } = useParams();

    const mainMenu = (visID === "home") ? true : false;

    return (
        <div>
            <div className="d-flex align-items-center">
                <Link className="btn btn-link ps-0 pt-0 pb-0" to="../devices">
                    <i className="bi bi-chevron-left m-0" alt="Back to devices"></i>
                </Link>
                <h5 className="m-0">Data Management</h5>
            </div>
            {/*<div className="mt-3">
                <h6>Available Data</h6>
                <p className='mb-2'>The devices are currently streaming the following data. Hover over a data source to learn more.</p>
                <AvailableDataInformation />
             </div> */}
            <p className='mb-2 mt-2'>Tune the parameters of the visualization! If there is a stream of data, you'll be able to map the parameters to the stream</p>
            {!(mainMenu) ?
                <DataManagement /> : null}
        </div>
    )
}