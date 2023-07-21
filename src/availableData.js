import React, { useEffect, useState, useRef } from 'react';

import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

function PopupItem({item}) {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    return (
        <div className="col border border-primary-subtle rounded-pill me-2" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)} key={item.name}>
            <div className='d-flex m-2 justify-content-between align-items-start' key={item.name}>
                <div  ref={target}>{item.name} </div>
                {/*<i ref={target} type="button" className="bi bi-question-circle" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(!show)}></i>*/}
                <Overlay className="custom-tooltip" target={target.current} show={show} placement="bottom">
                    {(props) => (
                    <Tooltip id="overlay-example" className="custom-tooltip" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(!show)} {...props}>
                        <p>{item.description}</p>
                        <small>Source: {item.source}</small><br/>
                        <small>Type: {item.type}</small>
                    </Tooltip>
                    )}
                </Overlay>
            </div>
        </div>
    )
}

function DataCards({source, popupInfo}) {
    const dataArray=[];
    function appendToArray(value, info) {
        const datatoAppend=info.find(x=>x.heading===value).data.map((obj)=>{
                obj["source"]=value;
                return obj;
            });
        return datatoAppend;
    }

    for (const valor in source) {
        if (source[valor]) {
            dataArray.push(appendToArray(valor, popupInfo));
        }
    }
    const showData=dataArray.flat();

    return (        
    <div className="row row-cols-auto mb-3">
        {(showData.length!==0)?showData.map((item)=><PopupItem item={item} key={item.name}/>):<small>No available data</small>}
    </div>
    )
}

export default function AvailableDataInformation({source, popupInfo}) {

    const [dataCard, updateDataCard]=useState(<DataCards source={source} popupInfo={[...popupInfo]}/>);
    useEffect(()=>updateDataCard(<DataCards source={source} popupInfo={[...popupInfo]}/>), [source]);
    
    return (
        <div className='container'>
            {dataCard}
        </div>
    )
}