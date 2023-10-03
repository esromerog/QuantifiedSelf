import React, { useState, useRef } from 'react';

import devicesRaw from '../../../metadata/devices';
import { useDispatch, useSelector } from 'react-redux';
import { EmotivConnection } from './stream_functions/emotiv';
import { RecordedDataButton } from './stream_functions/file_upload';
import { selectDevices } from './mainDevices';


function EmotivDeviceButton({ data, name, handleShow }) {

    return (
        <div className='card rounded-0 mb-2 mt-1'>
            <button className="card-body btn btn-link text-decoration-none text-start" onClick={() => handleShow(name)}>
                <h5 className="card-title g-0 m-0">{name}</h5>
                <small className='g-0 m-0'>{data.heading}</small>
            </button>
        </div>
    );
}



function FileDeviceButton({ data, name, handleShow }) {


    const streamObject = useSelector(state=>state.deviceMeta[name].object);

    const playing = useSelector(state=>state.deviceMeta[name].playing);
    const looping = useSelector(state=>state.deviceMeta[name].looping);

    function startStreaming() {
        streamObject.startPlayback();
    }

    function pauseStreaming() {
        streamObject.pausePlayback();
    }

    function loopStreaming() {
        streamObject.loopPlayback();
    }

    function restartStreaming() {
        streamObject.restartPlayback();
    }

    console.log(playing);

    return (
        <div className='card-group'>
            <div className='card rounded-0 mb-2 mt-1'>
                <button className="card-body btn btn-link text-decoration-none text-start" onClick={() => handleShow(name)}>
                    <h5 className="card-title g-0 m-0">{name}</h5>
                    <small className='g-0 m-0'>{data.heading}</small>
                </button>
            </div>
            <div className='card rounded-0 mb-2 mt-1'>
                <div className="card-body d-flex align-items-center justify-content-center">
                    <button className='btn btn-link'onClick={restartStreaming}><i className="bi bi-rewind" /></button>
                    {playing?
                    <button className='btn btn-link'><i className="bi bi-pause" onClick={pauseStreaming}/></button>
                    :<button className='btn btn-link'><i className="bi bi-play" onClick={startStreaming}/></button>}
                    <button className='btn btn-link'><i className={`bi bi-arrow-repeat ${looping?'text-primary':''}`} onClick={loopStreaming} /></button>
                </div>
            </div>
        </div>
    );
}

function DeviceList({ data, name, handleShow, uploaded }) {
    const deviceButton = {
        "EMOTIV": <EmotivDeviceButton data={data} name={name} handleShow={handleShow} />,
        "Upload": <FileDeviceButton data={data} name={name} handleShow={handleShow} />
    }

    let key = data.heading;

    if (uploaded) {
        key = "Upload"
    }

    return (
        <div key={name}>
            {deviceButton[key]}
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

    const deviceMeta = useSelector(state => state.deviceMeta)

    const deviceButtonList = Object.keys(deviceMeta)?.map((id) => {
        const data = devicesRaw.find(({ heading }) => deviceMeta[id].device === heading);
        const uploaded = "playing" in deviceMeta[id];
        return (
            <DeviceList data={data} name={id} handleShow={handleShow} key={id} uploaded={uploaded} />
        )
    });

    const deviceModal = {
        "EMOTIV": <EmotivConnection show={show} handleClose={handleClose} />
    }


    function getDeviceModal(id) {
        return (
            deviceModal[deviceMeta[id]?.device]
        )
    }

    return (
        <div>
            {deviceButtonList}
            {getDeviceModal(currId)}
        </div>
    );
}

