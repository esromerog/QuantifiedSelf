import React, { useState, useRef } from 'react';

import devicesRaw from '../../../metadata/devices';
import { useDispatch, useSelector } from 'react-redux';
import { EmotivConnection } from './stream_functions/emotiv';

import { Modal } from 'react-bootstrap';
import { ModalDataInformation } from './availableData';

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


    const streamObject = useSelector(state => state.deviceMeta[name].object);

    const playing = useSelector(state => state.deviceMeta[name].playing);
    const looping = useSelector(state => state.deviceMeta[name].looping);

    function startStreaming() {
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

    return (
        <div>
            <div className='row card-margin'>
                <div className='card rounded-0 mb-2 mt-1 col-8'>
                    <button className="card-body btn btn-link text-decoration-none text-start" onClick={() => handleShow(name)}>
                        <h5 className="card-title g-0 m-0">{name}</h5>
                        <small className='g-0 m-0'>{data.heading}</small>
                    </button>
                </div>
                <div className='card rounded-0 mb-2 mt-1 col-4'>
                    <div className="card-body d-flex align-items-center justify-content-center">
                        <button className='btn btn-link' onClick={restartStreaming}><i className="bi bi-rewind" /></button>
                        {playing ?
                            <button className='btn btn-link'><i className="bi bi-pause" onClick={pauseStreaming} /></button>
                            : <button className='btn btn-link'><i className="bi bi-play" onClick={startStreaming} /></button>}
                        <button className='btn btn-link'><i className={`bi bi-arrow-repeat ${looping ? 'text-primary' : ''}`} onClick={loopStreaming} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DeviceList({ data, name, handleShow, uploaded }) {
    const deviceButton = {
        "EMOTIV": <EmotivDeviceButton data={data} name={name} handleShow={handleShow} />,
        "Muse": <EmotivDeviceButton data={data} name={name} handleShow={handleShow} />,
        "Upload": <FileDeviceButton data={data} name={name} handleShow={handleShow} />
    }

    let key = data.heading;

    if (uploaded) {
        key = "Upload"
    }

    return (
        <div key={name} className='button-list'>
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
        "EMOTIV": <EmotivDeviceModal show={show} handleClose={handleClose} />,
        "Muse": <></>
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


function EmotivDeviceModal({ show, handleClose }) {
    // Modal to view the Emotiv Headset
    const device = devicesRaw.find(({ heading }) => heading === "EMOTIV");
    const source = ["EMOTIV"];

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{device.heading}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {device.description}
                <div className='mt-3'>
                    <h5>Available data streams</h5>
                    <p>This device can stream the following data to a visualization. Hover to learn more.</p>
                    <ModalDataInformation source={source} popupInfo={[device]} groupData={true} />
                </div>
            </Modal.Body>
        </Modal>
    )
}
