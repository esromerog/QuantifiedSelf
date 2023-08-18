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

function DataCards({source, popupInfo, groupData}) {
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
    console.log(dataArray)

    // Group data by type if it's defined
    if (groupData!==undefined) {
        
        const groupedData=showData.reduce(function(rv, x) {
            (rv[x["type"]] = rv[x["type"]] || []).push(x);
            return rv;
        }, {});

        const groupNames=Object.keys(groupedData);

        const groupDataCards=groupNames.map((group)=>{
            return (
                <div key={group}>
                    <h6 className='g-0 m-0 mb-2 ms-n1'>{group}</h6>
                    <div className="row row-cols-auto mb-3">
                    {groupedData[group].map((item)=>{
                        return <PopupItem item={item} key={item.name}/>
                    })}
                    </div>
                </div>
            )
        })
        return (
            <div>
                {groupDataCards}
            </div>
        )
    } else {
        return (  
            <div>   
                <div className="row row-cols-auto mb-3">
                    {(showData.length!==0)?showData.map((item)=>{
                        return <PopupItem item={item} key={item.name}/>
                    })
                    :<small>No available data from devices</small>}
                </div>
            </div>  
        )
    }
}

export default function AvailableDataInformation({source, popupInfo, groupData}) {

    const [dataCard, updateDataCard]=useState(<DataCards source={source} popupInfo={[...popupInfo]} groupData={groupData}/>);
    useEffect(()=>updateDataCard(<DataCards source={source} popupInfo={[...popupInfo]} groupData={groupData}/>), [source]);
    
    return (
        <div className='container'>
            {dataCard}
        </div>
    )
}