import React, { useState, useEffect } from 'react'


function DataManualSlider ({parameter, subparameter, updateValues, sources, changeSelection}) {

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
                <input type="text" className="form-control" id="valorManualInput" placeholder={valor} value={valor} onChange={handleFormChange}></input>
                <label className="visually-hidden" htmlFor="valorManualInput">{valor}</label>
                <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false"></button>
                <ul className="dropdown-menu">
                        {sources.map((option)=>
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

    const source=sources[selection];
    useEffect(()=>updateValues(parameter,subparameter.name, source), [source]);

    return (
        <div className="row justify-content-start">
        <div className="col-5">
            <div className="input-group">
                <input type="text" className="form-control" id="valorManualInput" value={selection+" value: "+subparameter.value} disabled readOnly></input>
                <label className="visually-hidden" htmlFor="valorManualInput">{subparameter.value}</label>
                <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false"></button>
                <ul className="dropdown-menu">
                    {Object.keys(sources).map((source)=>
                    <li key={source}><button type="button" 
                    className="dropdown-item" 
                    onClick={()=>changeSelection(source)}
                    >{source}</button></li>)}
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


    function changeSelection(option) {
        setSelection(option);
        if (option==="Manual") {
            setManual(true);
            defineAutoParameter(false);
        } else {
            setManual(false);
            defineAutoParameter(true);
        }
    }


    return (
    <li className="list-group-item py-4 container" key={subparameter.name}>
        <h6>{subparameter.name}</h6>
        {manual?
        <DataManualSlider parameter={parameter} subparameter={subparameter} updateValues={updateValues} sources={Object.keys(sources)} changeSelection={changeSelection}/>:
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
        <div className="accordion mt-3">
            {dataCards}
        </div>
    );
}