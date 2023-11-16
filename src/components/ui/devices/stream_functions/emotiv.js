import CortexPower from '../../../utility/cortex';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import { useDispatch, useSelector } from 'react-redux';
import { ModalDataInformation } from '../availableData';
import devicesRaw from '../../../../metadata/devices.json'


const device = devicesRaw.find(({ heading }) => heading === "EMOTIV");

export function EmotivConnection({ show, handleClose }) {
    // Modal to connect to the Emotiv headset

    const dispatch = useDispatch();

    const [connText, setConnText] = useState({ text: "", type: "" });
    const [disabled, setDisabled] = useState(false);

    function handleActive() {
        let socketUrl = 'wss://localhost:6868'
        // this key does not inquire for EEG raw data
        let user = {
            "license": process.env.REACT_APP_CORTEX_LICENSE,
            "clientId": process.env.REACT_APP_CORTEX_CLIENT_ID,
            "clientSecret": process.env.REACT_APP_CORTEX_CLIENT_SECRET,
            "debit": 100
        }

        const c = new CortexPower(user, socketUrl);
        c.sub(['pow', 'eeg', 'mot']);

        setConnText({ text: "Attempting connection ...", type: "text-warning" });
        setDisabled(true);
        setTimeout(() => {
            const id = c.headsetId;
            if (c.sessionId !== undefined) {
                setConnText({ text: " ", type: "text-success" });
                dispatch({
                    type: 'devices/create',
                    payload: {
                        id: id,
                        metadata: {
                            device: "EMOTIV",
                            type: "default",
                            id: id
                        }
                    }
                })
            } else {
                setConnText({ text: "Unable to connect", type: "text-danger" });
                setDisabled(false);
            }
        }, 2000);
    }

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
            <Modal.Footer className="d-flex justify-content-between">
                <p className={connText.type}>{connText.text}</p>
                {!(connText.text === " ") ?
                    (<button type="button" className="btn btn-outline-dark" onClick={handleActive} disabled={disabled}><i className="bi bi-bluetooth me-2"></i>Connect</button>) :
                    (<div className="text-success mt-1 mb-1">Connected</div>)}
            </Modal.Footer>
        </Modal>
    )
}