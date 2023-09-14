import React, {useEffect} from 'react';

import { subToStore, stopRecording } from '../utility/recorder';


export function RecordComponent({recording, setRecording, saveObject}) {
    // Save object might be changed to a hook?

    const buttonClassName = (recording != false)?"btn btn-outline-danger":"btn btn-outline-dark";
    const iconClassName = (recording != false)?"bi bi-stop-circle":"bi bi-record-circle";
    const recordingText = (recording != false)?"Stop recording":"Record data";
    
    const handleClick = () => {
        if (recording == false) {
            setRecording(subToStore(saveObject));
        } else {
            stopRecording(recording, saveObject);
            setRecording(false);
        }
    }
    /*
    Code used to save it in session storage. This useEffect aims to prevent sessionStorage persisting after the component is unmounted.
    This may be used anywhere that is only loaded/mounted once in the webpage to clear the sessionstorage.
    
    useEffect(()=>{
        sessionStorage.setItem("data", JSON.stringify([]))
        return () => {
          sessionStorage.removeItem("data");
        }
    }, [])
    */
   
    return (
        <button className={buttonClassName} onClick={handleClick}>
            <i className={iconClassName}> {recordingText}</i>
        </button>
    )
}