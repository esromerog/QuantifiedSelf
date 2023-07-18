import React, { useEffect, useState, useRef } from 'react';


import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';


function PopupItem({item}) {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    return (
        <div className="col border rounded-pill me-2" key={item.name}>
            <div className='d-flex m-1 justify-content-between align-items-start' key={item.name}>
                <div className="me-2">{item.name}</div>
                <i ref={target} type="button" className="bi bi-question-circle" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(!show)}></i>
                <Overlay className="custom-tooltip" target={target.current} show={show} placement="right">
                    {(props) => (
                    <Tooltip id="overlay-example" className="custom-tooltip" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)} {...props}>
                        {item.description}
                    </Tooltip>
                    )}
                </Overlay>
            </div>
        </div>
    )
}

function DataCards({source, popupInfo}) {

    let dataArray=[];
  
    function appendToArray(value, info) {
    const datatoAppend=info.find(x=>x.heading=value).data.map((obj)=>{
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
    
    dataArray=dataArray.flat();
  
    console.log(dataArray);

    return (        
    <div className="row row-cols-auto">
        {dataArray.map((item)=><PopupItem item={item} key={item.name}/>)}
    </div>
    )
}


export default function AvailableDataInformation({source, popupInfo}) {
    
    const [dataCard, updateDataCard]=useState(<DataCards source={source} popupInfo={popupInfo}/>);
    useEffect(()=>updateDataCard(<DataCards source={source} popupInfo={popupInfo}/>), [source]);
    
    return (
        <div className='container mt-3'>
            {dataCard}
        </div>
    )
  }