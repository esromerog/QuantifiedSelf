import CortexPower from './components/cortex';
import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';


// Emotiv
function CortexComp(oldData, handleValue) {
    let socketUrl = 'wss://localhost:6868'
        // this key does not inquire for EEG raw data
    let user = {
        "license":"",
        "clientId":"BY2tKexlRKRaiVt5nbixVfj4Ip42BrVW2xUmJvmL",
        "clientSecret":"s5Ham3dnkkAVHjI88d64WVcZ8UUn5jJ0zi3DfbT4FAOIJgyQtZZ8HORc8VZInMqx1oJgMu9HNQzZwoGSqap9g7KSuFQN5fjSUpex9NtjVAUUfQqfC3FHG0PVvW0yZxyp",
        "debit":100
    }
    const c=new CortexPower(user, socketUrl, oldData, handleValue);
  
    c.sub(['pow','eeg']);
  
}

export function Emotiv({setDeviceActive, deviceStates, deviceStream, handleValue}) {
    const [texto, setTexto]=useState({text:"", type:""});
    const [disabled, setDisabled]=useState(false);

    function handleActive() {
        const previousValue=deviceStream["Emotiv"]["Alpha"];
        CortexComp(deviceStream, handleValue);
        setTexto({text:"Attempting connection ...", type:"text-warning"});
        setDisabled(true);
        setTimeout(() => {
            if (previousValue!==deviceStream["Emotiv"]["Alpha"]) {
                setDeviceActive();
                setTexto({text:"", type:""});
            } else {
                setTexto({text:"Unable to connect", type:"text-danger"});
                setDisabled(false);
            }
        }, 2000);
    }

    return (
        <Modal.Footer className="d-flex justify-content-between">
            <p className={texto.type}>{texto.text}</p>
            {(!deviceStates["Emotiv"])?
            (<button type="button" className="btn btn-outline-dark" onClick={handleActive} disabled={disabled}><i className="bi bi-bluetooth me-2"></i>Connect</button>):
            (<div className="text-success mt-1 mb-1">Connected</div>)}
        </Modal.Footer>
    )
    
}
