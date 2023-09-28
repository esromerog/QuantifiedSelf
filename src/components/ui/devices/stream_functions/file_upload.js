import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import devicesRaw from '../../../../metadata/devices';
import { useDispatch } from 'react-redux';

import Modal from 'react-bootstrap/Modal';
import store from '../../../../store';

export function FileUploader({ show, handleClose }) {

    const dispatch = useDispatch();

    const [recordingDevice, setRecordingDevice] = useState("");
    const [successText, setSuccessText] = useState("");

    async function uploadFile(e) {
        if (recordingDevice==="") {
            setSuccessText("You must first specify the device, please try again")
            return
        }

        const form = e.currentTarget;
        const [file] = await form.files;
        console.log(file);

        // If I were working with a server, I could post the files to a URL
        // The current solution is to save them into session storage
        // The limitation is that this limits the size of session storage
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                // results.data - contains the uploaded file output
                sessionStorage.setItem(recordingDevice, JSON.stringify(results.data))
                dispatch({ type: 'devices/create', payload: { id: recordingDevice + "81", metadata: { device: recordingDevice } } })
                setSuccessText("Uploaded!");
            },
            error: (error) => {
                setSuccessText("There was an error with the file you uploaded, please try again.")
                console.log(error)
            }
        })
    }

    const successTextStyle = (successText !== "Uploaded!") ? "text-warning" : "text-success";

    const deviceList = ["EMOTIV"];
    const dropdownMenu = deviceList.map((item) =>
        <option value={item}>
            {item}
        </option>
    )

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Upload a file</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Upload the recorded file from your computer.
                It is important that you specify the device that was used to record that file.

                <div className='row mt-3'>
                    <div className='col-4'>
                        <select className="form-select" defaultValue="" onChange={e => setRecordingDevice(e.target.value)}>
                            <option value="">Choose the device</option>
                            {dropdownMenu}
                        </select>
                    </div>
                    <div className='input-group col' >
                        <input 
                            type="file" 
                            className='form-control' 
                            id="inputUpload" 
                            accept="text/csv" 
                            onChange={uploadFile}
                            disabled={(recordingDevice!=="")} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex justify-content-between'>
                    <p className={successTextStyle}>{successText}</p>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

function streamRecordedData(id) {
    let i = 0;

    const userFile = JSON.parse(sessionStorage.getItem(device));

    // I fetch the sampling rate using the device name
    const samplingRate = devicesRaw.find(({ heading }) => device.includes(heading)).sampling_rate;

    var streamRecorder = setInterval(() => {
        store.dispatch({
            type: 'devices/streamUpdate',
            payload: {
                id: id,
                data: userFile[i]
            }
        })

        store.dispatch({
            type: 'devices/updateMetadata',
            payload: {
                id: id,
                field: "buffer_num",
                data: i
            }
        })

        i++;
        if (i > userFile.length - 1) {
            clearInterval(streamRecorder);
            console.log(device);
        }
    }, 1000 / samplingRate);
}

export function RecordedDataButton({ data, handleShow, name }) {
    const [playing, setPlaying] = useState((!name.includes("Inactive")));

    function startStreaming() {
        streamRecordedData(name)
        setPlaying(true);
    }

    return (
        <div className='d-flex'>
            <button type="button" className="list-group-item list-group-item-action" onClick={() => handleShow(data)}>
                <div className="d-flex w-100 justify-content-between mt-2">
                    <h5 className="mb-1">{data.heading}</h5>
                    <small>{name + "(Pre-recorded)"}</small>
                </div>
                {/*<p className="mb-2">{data.short_description}</p>*/}
            </button>
            <button className="btn btn-link" onClick={startStreaming} disabled={playing}>
                <i className="bi bi-play-circle-fill"></i>
            </button>
        </div>
    );
}




