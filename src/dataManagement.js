import React, { useState, useEffect } from 'react'


function getDataStreamKeys(dataStreamObject) {
    console.log(dataStreamObject);
    const returnItems=[];
    for (const valor in dataStreamObject) {
        for (const datos in dataStreamObject[valor]) {
            returnItems.push(valor+" "+datos);
        }
    }
    return returnItems;
}

function DataManualSlider ({parameter, subparameter, updateValues, sources, changeSelection}) {
    const claves=getDataStreamKeys(sources);
    claves.push("Manual");
    const valor=subparameter.value;

    const min=0;
    const max=100;
    
    function handleInputChange(e) {
        updateValues(parameter, subparameter.name, e.target.value);
    }

    function handleFormChange(e) {
        let formValue=e.target.value;
        if (formValue>max) {
            formValue=max;
        } else if (formValue<min) {
            formValue=min;
        }
        updateValues(parameter, subparameter.name,formValue);
        e.target.value=formValue;
    }
    return (
    <div className="row justify-content-start">
        <div className="col-3">
            <div className="input-group">
                <div className="form-floating">
                    <input type="text" className="form-control" id="valorManualInput" placeholder={valor} value={valor} onChange={handleFormChange}></input>
                    <label htmlFor="valorManualInput">Value</label>
                </div>
                <label className="visually-hidden" htmlFor="valorManualInput">{valor}</label>
                <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false"></button>
                <ul className="dropdown-menu">
                        {claves.map((option)=>
                            <li key={option}><button type="button" 
                            className="dropdown-item" 
                            onClick={()=>changeSelection(option)}
                            >{option}</button></li>)}
                    </ul>
            </div>
        </div>
        <div className='col-9 align-self-center'><input type="range" className="form-range align-self-center" onChange={handleInputChange} id="customRange1" value={valor} min={min} max={max}></input></div>
    </div>
    )
}


function DataConnection ({selection, changeSelection, subparameter, parameter, updateValues, sources}) {
    const select=selection.split(" ");
    let source;

    try {
        source=sources[select[0]][select[1]];
    } catch (error) {
        source=subparameter.value;
    }

    useEffect(()=>updateValues(parameter,subparameter.name, source), [source]);
    const claves=getDataStreamKeys(sources);
    claves.push("Manual");
    return (
        <div className="row justify-content-start">
        <div className="col-5">
            <div className="input-group">
                <div className="form-floating">
                <input type="text" className="form-control" id="valorManualInput" value={subparameter.value} readOnly></input>
                <label htmlFor="valorManualInput">{selection}</label>
                </div>
                <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false"></button>
                <ul className="dropdown-menu">
                        {claves.map((option)=>
                            <li key={option}><button type="button" 
                            className="dropdown-item" 
                            onClick={()=>changeSelection(option)}
                            >{option}</button></li>)}
                </ul>
            </div>
        </div>
        <div className='col-4 align-self-center'></div>
        </div>
    )  
}


function ParameterManager ({subparameter, sources, updateValues, parameter, defineAutoParameter}) {

    const [manual, setManual]=useState(true)
    const [selection, setSelection]=useState("");
    const select=selection.split(" ");

    function changeSelection(option) {
        if (option==="Manual") {
            setManual(true);
            defineAutoParameter(false);
        } else {
            setManual(false);
            defineAutoParameter(true);
        }
        setSelection(option);
    }

    useEffect(()=>{if (!sources.hasOwnProperty(select[0])) {setManual(true);}}, [sources]);

    return (
    <li className="list-group-item py-4 container" key={subparameter.name}>
        <h6>{subparameter.name}</h6>
        {manual?
        <DataManualSlider parameter={parameter} subparameter={subparameter} updateValues={updateValues} sources={sources} changeSelection={changeSelection}/>:
        <DataConnection parameter={parameter} subparameter={subparameter} updateValues={updateValues} sources={sources} selection={selection} changeSelection={changeSelection} />
        }
    </li>
    )
}

function DataCard({visParameter, updateValues, sources}) {
    const [hasAuto, setHasAuto]=useState(false);
    let subparameters;

    if (Array.isArray(visParameter.value)) {
        subparameters=visParameter.value;
    } else {
        subparameters=[visParameter];
    }

    const mapeo=subparameters?.map((param)=><ParameterManager parameter={visParameter.name} subparameter={param} sources={sources} updateValues={updateValues} key={param.name} defineAutoParameter={setHasAuto}/>);
    // Pasar visParameters a DataCardManager
    return (
    <div className={hasAuto?"accordion-item accordion-custom":"accordion-item"} key={visParameter.name}>
        <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={'#'+visParameter.name} aria-expanded="false" aria-controls="collapseTwo">
            {visParameter.name}
            </button>
        </h2>
        <div id={visParameter.name} className="accordion-collapse collapse">
            <div className="accordion-body">
                <ul className="list-group list-group-flush my-n2">
                    {mapeo}
                </ul>
            </div>
        </div>
    </div>
    );
}


export default function DataManagement({deviceStream, updateValues, visParameters}) {


    const dataCards = visParameters?.map((parameter)=>(<DataCard visParameter={parameter} sources={deviceStream} updateValues={updateValues} key={parameter.name} />));

    return (
        <div>
            <div className="accordion mt-3">
                {dataCards}
            </div>
        </div>
    );
}