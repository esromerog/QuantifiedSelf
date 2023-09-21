import CortexPower from '../../../utility/cortex';
import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';


// Actual connection logic
function CortexComp() {
    let socketUrl = 'wss://localhost:6868'
    // this key does not inquire for EEG raw data
    let user = {
        "license":process.env.REACT_APP_CORTEX_LICENSE,
        "clientId": process.env.REACT_APP_CORTEX_CLIENT_ID,
        "clientSecret": process.env.REACT_APP_CORTEX_CLIENT_SECRET,
        "debit":100
    }
    // for testing

    const c=new CortexPower(user, socketUrl);
    c.sub(['pow','eeg','mot']);
}


export function Emotiv() {

    const deviceStream=useSelector(state=>state.deviceStream);
    const deviceStreamRef = React.useRef(deviceStream);
    deviceStreamRef.current = deviceStream;

    const deviceStates=useSelector(state=>state.deviceStates);
    const dispatch = useDispatch();

    const [connText, setConnText]=useState({text:"", type:""});
    const [disabled, setDisabled]=useState(false);

    function handleActive() {
        CortexComp();
        setConnText({text:"Attempting connection ...", type:"text-warning"});
        setDisabled(true);
        setTimeout(() => {
            if (deviceStreamRef.current["EMOTIV"]!==undefined) {
                dispatch({type: 'devices/statesUpdate', payload: "EMOTIV"});
                setConnText({text:"", type:""});
            } else {
                setConnText({text:"Unable to connect", type:"text-danger"});
                setDisabled(false);
            }
        }, 2000);
    }
    
    return (
        <Modal.Footer className="d-flex justify-content-between">
            <p className={connText.type}>{connText.text}</p>
            {(!deviceStates["emotiv"])?
            (<button type="button" className="btn btn-outline-dark" onClick={handleActive} disabled={disabled}><i className="bi bi-bluetooth me-2"></i>Connect</button>):
            (<div className="text-success mt-1 mb-1">Connected</div>)}
        </Modal.Footer>
    )
    
}