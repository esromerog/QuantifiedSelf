import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useSelector } from "react-redux";

import RenderDevices from "./devicesTab";

import AvailableDataInformation from "./availableData";
import { Emotiv } from "./stream_functions/emotiv";

import DataManagement from '../visuals/dataManagement';


export default function DevicesMainWindow() {

    const visMetadata = useSelector(state => state.visMetadata);

    const deviceStreamFunctions = {
        Emotiv: <Emotiv />,
    };

    const mainMenu = ("name" in visMetadata) ? false : true;

    const [toggleData, setToggleData] = useState(false);

    return <div>{!toggleData ?
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="m-0 pb-2 pt-2">Data Sources</h5>
                {(!mainMenu) ?
                    <button className="btn btn-link text-decoration-none" onClick={() => setToggleData(true)}>
                        <small className="m-0 ">Data Management  </small><i className="bi bi-arrow-right" alt="Go to data management"></i>
                    </button> : null}
            </div>
            <div>
                <RenderDevices
                    deviceStreamFunctions={deviceStreamFunctions} />
            </div>
        </div> :
        <div>
            <div className="d-flex align-items-center">
                <button className="btn btn-link ps-0 pt-0 pb-0" onClick={() => setToggleData(false)}>
                    <i className="bi bi-chevron-left m-0" alt="Back to devices"></i>
                </button>
                <h5 className="m-0">Data Management</h5>
            </div>
            <div className="mt-3">
                <h6>Available Data</h6>
                <p className='mb-2'>The devices are currently streaming the following data. Hover over a data source to learn more.</p>
                <AvailableDataInformation />
            </div> {!(mainMenu) ?
                <DataManagement visInfo={visMetadata} /> : null}
        </div>
    }</div>
}