import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import AvailableDataInformation from "./availableData";
import CortexPower from './components/cortex';

function DeviceButton({data, handleShow, deviceStates}) {
return (
    <button type="button" className={(deviceStates[data.heading])?"list-group-item list-group-item-action list-devices shadow-sm active":"list-group-item list-group-item-action list-devices shadow-sm"} onClick={()=>handleShow(data)}>
        <div className="d-flex w-100 justify-content-between mt-2">
        <h5 className="mb-1">{data.heading}</h5>
        <small>{data.type}</small>
        </div>
        <p className="mb-2">{data.description}</p>
    </button>
);
}

export default function RenderDevices({data, deviceStates, handleDeviceStates, deviceStream, handleValue}) {
    const [activeData, setActiveData] = useState(data[1]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    function handleShow(data) {setShow(true); setActiveData(data)}

    const deviceButtonList=data?.map((datos) => {
    return (<DeviceButton 
        data={datos}
        key={datos.heading}
        handleShow={handleShow}
        deviceStates={deviceStates}
    ></DeviceButton>)});

    return (
    <div>
        {/*<div><Expand data={data} key="General"/></div>*/}
        <div className="mt-3">
            <ul className="list-group">
            {deviceButtonList}
            </ul>
        </div>
        <ConnectionWindow show={show} handleClose={handleClose} data={activeData} setDeviceActive={()=>handleDeviceStates(activeData.heading)} deviceStates={deviceStates} deviceStream={deviceStream} handleValue={handleValue}/>
    </div>
    );


}


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

function ConnectionWindow({show, handleClose, data, setDeviceActive, deviceStates, deviceStream, handleValue}) {


    const [texto, setTexto]=useState({text:"", type:""});
    const source={};
    source[data.heading]=true;
    const [disabled, setDisabled]=useState(false);
    
    function handleActive() {
        const previousValue=deviceStream["Muse"]["Alpha"];
        CortexComp(deviceStream, handleValue);
        setTexto({text:"Attempting connection ...", type:"text-warning"});
        setDisabled(true);
        setTimeout(() => {
            if (previousValue!==deviceStream["Muse"]["Alpha"]) {
                console.log("Streaming");
                setDeviceActive();
                setTexto({text:"", type:""});
            } else {
                setTexto({text:"Unable to connect", type:"text-danger"});
                setDisabled(false);
            }
        }, 2000);
    }


    return (
    <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{data.heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {data.description}
            <div className='mt-3'>
                <h6>Available data streams</h6>
                <p>This device can stream the following data to a visualization. Hover to learn more.</p>
                <AvailableDataInformation source={source} popupInfo={[data]}/>
            </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
            <p className={texto.type}>{texto.text}</p>
            {(!deviceStates[data.heading])?
            (<button type="button" className="btn btn-outline-dark" onClick={handleActive} disabled={disabled}><i className="bi bi-bluetooth me-2"></i>Connect</button>):
            (<div>Connected</div>)}
        </Modal.Footer>
     </Modal>
    )
}