import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import devicesRaw from '../../../metadata/devices';
import { useDispatch } from 'react-redux';

export function FileUploader() {

    const [userFile, setUserFile] = useState();
    const [streamingDevice, setStreamingDevice] = useState();
    const dispatch = useDispatch();

    async function handleChange(e) {
        const form = e.currentTarget;
        const [file] = await form.files;
        console.log(file);

        

        const device = devicesRaw.find(({heading}) => heading.toLowerCase() === file.name.split("_")[0]);

        if (device!==undefined) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    
                    setStreamingDevice(device);
                    console.log(device);
                    setUserFile(results.data);
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
    }

    function streamRecordedData() {
        let i = 0;

        // const device = streamFile[0].device
        // const 
        // delete streamFile[0].device
        const device = streamingDevice.heading;
        const samplingRate = devicesRaw.find(({heading}) => heading === device).sampling_rate;

        dispatch({type: 'devices/statesUpdate', payload: device});

        var streamRecorder = setInterval(() => {
            dispatch({type:'devices/streamUpdate', payload: {device: device, data: userFile[i]}})
            console.log(userFile[i]);
            i++;
            if (i > userFile.length-1) {
                clearInterval(streamRecorder);
                console.log(device);
                dispatch({type: 'devices/statesUpdate', payload: device});
            }
        }, 1000);
    }


    return (
        <>
            <div className='input-group' >
                <label htmlFor="inputUpload">Upload a file</label>
                <input type="file" className='form-control' id="inputUpload" accept = "text/csv" onChange={handleChange} />
            </div>
            <button className='btn btn-primary'
                onClick = {streamRecordedData}
                disabled = {(userFile===undefined)} >
                Play
            </button>
        </>
    )
}