// Courtesy of https://github.com/urish/muse-js/tree/master/demo
// Works on Edge or Chrome - Versions post 2016

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import devicesRaw from '../../../../metadata/devices.json'
import { useDispatch, useSelector } from 'react-redux';
import { MuseClient } from 'muse-js';
import { ModalDataInformation } from '../availableData';

const device = devicesRaw.find(({ heading }) => heading === "Muse");




export function MuseConnection({ show, handleClose }) {

    const dispatch = useDispatch()

    const [connText, setConnText] = useState({ text: "", type: "" });
    const [disabled, setDisabled] = useState(false);
    const id = "Muse";
    const [reading, setReading] = useState([]);

    async function handleConnect() {
        let client = new MuseClient();
        await client.connect()
            .then(() => {
                setConnText({ text: " ", type: "text-success" });
                dispatch({
                    type: 'devices/create',
                    payload: {
                        id: client.deviceName,
                        metadata: {
                            device: "Muse",
                        }
                    }
                })
            })
            .catch(() => {
                setConnText({ text: "Unable to connect", type: "text-danger" });
            });
        await client.start();
        client.eegReadings.subscribe((reading)=>console.log(reading)) ;
        console.log()
        /*
        client.eegReadings.subscribe(reading => {
            if (reading.length < 5) {

            }
            console.log(reading);
            dispatch({
                type: 'devices/streamUpdate',
                payload: { id: this.headsetId, data: newData }
            })
        });
        /*
        client.telemetryData.subscribe(telemetry => {
          console.log(telemetry);
        });
        client.accelerometerData.subscribe(acceleration => {
          console.log(acceleration);
        });*/
    }


    const source = ["Muse"];

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
            <Modal.Footer className="d-flex justify-content-between">
                <p className={connText.type}>{connText.text}</p>
                {!(connText.text === " ") ?
                    (<button type="button" className="btn btn-outline-dark" onClick={handleConnect} disabled={disabled}><i className="bi bi-bluetooth me-2"></i>Connect</button>) :
                    (<div className="text-success mt-1 mb-1">Connected</div>)}
            </Modal.Footer>
        </Modal>
    )
}