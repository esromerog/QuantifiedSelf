import React, { useState } from 'react';

import devicesRaw from '../../../metadata/devices';
import { useSelector } from 'react-redux';
import { EmotivConnection } from './stream_functions/emotiv';
import { RecordedDataButton } from './stream_functions/file_upload';
import { selectDevices } from './mainDevices';


function EmotivDeviceButton({ data, name, handleShow }) {

    return (
        <div>
            <button type="button" className="list-group-item list-group-item-action" onClick={() => handleShow(data)}>
                <div className="d-flex w-100 justify-content-between mt-2">
                    <h5 className="mb-1">{data.heading}</h5>
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
            {deviceButton[name]}
        </div>
    )

}

export default function RenderDevices() {
    const [show, setShow] = useState(false);

    function handleShow(data) { 
        setShow(true) 
    };

    const handleClose = () => setShow(false);

    const activeDevices = useSelector(selectDevices);

    const deviceButtonList = activeDevices?.map((deviceName) => {
        const data = devicesRaw.find(({ heading }) => deviceName.includes(heading));
        return (
            <DeviceList data={data} name={deviceName} handleShow={handleShow} />
        )
    });

    const deviceModal = {
        "EMOTIV": <EmotivConnection show={show} handleClose={handleClose} />
    }

    return (
        <div>
            <div className="mt-1">
                <ul className="list-group">
                    {deviceButtonList}
                </ul>
            </div>
            {deviceModal["EMOTIV"]}
        </div>
    );
}

