import React, { useState } from 'react';

import devicesRaw from '../../../metadata/devices';
import { useSelector } from 'react-redux';
import { EmotivConnection } from './stream_functions/emotiv';
import { RecordedDataButton } from './stream_functions/file_upload';
import { selectDevices } from './mainDevices';


function EmotivDeviceButton({ data, name, handleShow }) {

    return (
        <div>
            <button type="button" className="list-group-item list-group-item-action" onClick={() => handleShow(name)}>
                <div className="d-flex w-100 justify-content-between mb-3 mt-1">
                    <h5 className="mb-2">{data.heading}</h5>
                    <small>{name}</small>
                </div>
            </button>
        </div>
    );
}

function DeviceList({ data, name, handleShow }) {
    const deviceButton = {
        "EMOTIV": <EmotivDeviceButton data={data} name={name} handleShow={handleShow} />
    }

    return (
        <div>
            {deviceButton[data.heading]}
        </div>
    )

}

export default function RenderDevices() {
    const [show, setShow] = useState(false);
    const [currId, setCurrId] = useState("");
    
    function handleShow(data) { 
        setShow(true);
        setCurrId(data);
    };

    const handleClose = () => setShow(false);

    const deviceMeta = useSelector(state=>state.deviceMeta)

    const deviceButtonList = Object.keys(deviceMeta)?.map((id) => {
        const data = devicesRaw.find(({ heading }) => deviceMeta[id].device===heading);
        return (
            <DeviceList data={data} name={id} handleShow={handleShow} />
        )
    });

    const deviceModal = {
        "EMOTIV": <EmotivConnection show={show} handleClose={handleClose} />
    }


    function getDeviceModal(id) {
        return (
            deviceModal[deviceMeta[id].device]
        )
    }

    return (
        <div>
            <div className="mt-1">
                <ul className="list-group">
                    {deviceButtonList}
                </ul>
            </div>
            {getDeviceModal(currId)}
        </div>
    );
}

