import React from 'react';
import { useSelector } from "react-redux";

import RenderDevices from "./devicesTab";

import AvailableDataInformation from "./availableData";
import { Emotiv } from "./stream_functions/emotiv";

import DataManagement from '../visuals/dataManagement';
import { Link, useParams } from 'react-router-dom';


export function DeviceSelectionWindow() {
    const { visID } = useParams();

    const mainMenu = (visID === "home")?true:false;
    
    const deviceStreamFunctions = {
        Emotiv: <Emotiv />,
    };

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
                <RenderDevices
                    deviceStreamFunctions={deviceStreamFunctions} />
            </div>
        </div>
    )
}

export function DataManagementWindow(){
    const { visID } = useParams();

    const mainMenu = (visID === "home")?true:false;

    return (
        <div>
            <div className="d-flex align-items-center">
                <Link className="btn btn-link ps-0 pt-0 pb-0" to="../devices">
                    <i className="bi bi-chevron-left m-0" alt="Back to devices"></i>
                </Link>
                <h5 className="m-0">Data Management</h5>
            </div>
            <div className="mt-3">
                <h6>Available Data</h6>
                <p className='mb-2'>The devices are currently streaming the following data. Hover over a data source to learn more.</p>
                <AvailableDataInformation />
            </div> {!(mainMenu) ?
                <DataManagement /> : null}
        </div>
    )
}