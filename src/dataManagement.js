import React, { useState, useEffect, useRef } from 'react'

import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';



function getDataStreamKeys(dataStreamObject, deviceStates) {
    const returnItems=[];
    for (const valor in dataStreamObject) {
        if (deviceStates[valor]) {
            for (const datos in dataStreamObject[valor]) {
                returnItems.push(valor+": "+datos);
            }
        }
    }
    return returnItems;
}

function DataManualSlider ({parameter, subparameter, updateValues, changeSelection, claves, activeVisParameters}) {

    let valor;
    
    if (parameter===subparameter.name) {
        valor=activeVisParameters[parameter];
    } else {
        valor=activeVisParameters[parameter][subparameter.name];
    }

    const min=0;
    const max=1;
    
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
        updateValues(parameter, subparameter.name, formValue);
        e.target.value=formValue;
    }
    return (
    <div className="row justify-content-start">
        <div className="col-xl-3 col-lg-6">
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
        <div className='col-xl-9 col-lg-6 align-self-center'><input type="range" className="form-range align-self-center" onChange={handleInputChange} id="customRange1" value={valor} step={0.01} min={min} max={max}></input></div>
    </div>
    )
}


function DataConnection ({selection, changeSelection, subparameter, parameter, updateValues, sources, claves}) {

    const [show, setShow] = useState(false);
    const target = useRef(null);

    const select=selection.split(": ");
    let source;

    const [min, setMin]=useState(0);
    const [max, setMax]=useState(1);

    const [disabled, setDisabled]=useState(false);
    const [formMin, setFormMin]=useState(0);
    const [formMax, setFormMax]=useState(1);

    try {
        source=sources[select[0]][select[1]];
    } catch (error) {
        source=subparameter.value;
    }

    function looseFocusMin() {
        if (parseFloat(formMin)>max) {
            setFormMin(parseFloat(max)-1);
        }
        if (parseFloat(formMin)===max){
            setFormMin(parseFloat(max)-1);
        }
        setMin(formMin);
    }

    function looseFocusMax() {
        const valor=parseFloat(formMax);
        if (valor<min) {
            setFormMax(parseFloat(min)+1);
        }
        if (valor===min){
            setFormMax(parseFloat(min)+1);
        }
        setMax(parseFloat(formMax));
    }

    function normalizeValue(value, minimum, maximum) {
        const normalizedValue = (value - minimum) / (maximum - minimum);
        return normalizedValue;
    }

    const [buffer, setBuffer]=useState([false]);

    async function handleAutoSet() {
        setBuffer([])
        setDisabled(true);
    }
    useEffect(()=>{
        updateValues(parameter,subparameter.name, normalizeValue(source, min, max));
        if (typeof buffer[0]!=='boolean') {
            const buff=[...buffer, source];
            setBuffer(buff);
        }
        if (buffer.length>20) {
            setDisabled(false);

            const minimo=Math.min(...buffer);
            setMin(minimo);
            setFormMin(minimo);
    
            const maximo=Math.max(...buffer);
            setMax(maximo);
            setFormMax(maximo);

            setBuffer([false])
        }
    }, [source]);

    return (
        <div className="row justify-content-start">
            <div className="col-4">
                <div className="input-group">
                    <div className="form-floating">
                        <input type="text" className="form-control" id="valorManualInput" value={Math.round(source*1000)/1000 /*subparameter.value*/} readOnly></input>
                        <label htmlFor="valorManualInput">{select[1]}</label>
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
            <div className='col-8 align-self-center'>
                <div className="input-group">
                    <span ref={target} className="input-group-text" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>Range</span>
                    <Overlay className="custom-tooltip" target={target.current} show={show} placement="top">
                        {(props) => (
                        <Tooltip id="overlay-example" className="custom-tooltip" onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(!show)} {...props}>
                            Define a range of values for the visualization to consider.
                        </Tooltip>
                        )}
                    </Overlay>
                    <div className="form-floating">
                        <input type="text" className="form-control" id="max" placeholder={0} value={formMin} onBlur={looseFocusMin} readOnly={disabled} onChange={(e)=>{setFormMin(e.target.value)}}></input>
                        <label htmlFor="max">Min</label>
                    </div>
                    <div className="form-floating">
                        <input type="text" className="form-control" id="max" placeholder={100} value={formMax} onBlur={looseFocusMax} readOnly={disabled} onChange={(e)=>{setFormMax(e.target.value)}}></input>
                        <label htmlFor="max">Max</label>
                    </div>
                    <button className="btn btn-primary" onClick={handleAutoSet} disabled={disabled}>Auto range</button>
                </div>
            </div>
        </div>
    )  
}


function ParameterManager ({subparameter, sources, updateValues, parameter, defineAutoParameter, deviceStates, activeVisParameters}) {

    const claves=getDataStreamKeys(sources, deviceStates);
    claves.push("Manual");

    const [manual, setManual]=useState(true)
    const [selection, setSelection]=useState("");
    const select=selection.split(": ");

    function changeSelection(option) {
        if (option==="Manual") {
            setManual(true);
            defineAutoParameter(false);
        } else {
            setManual(false);
        }
        setSelection(option);
    }
    
    useEffect(()=>{if (!manual) {
        defineAutoParameter(true);
    }})

    useEffect(()=>{if (!sources.hasOwnProperty(select[0])) {setManual(true); defineAutoParameter(false)}}, [sources]);

    return (
    <li className="list-group-item py-4 container" key={subparameter.name}>
        <h6>{subparameter.name}</h6>
        {manual?
        <DataManualSlider parameter={parameter} subparameter={subparameter} updateValues={updateValues} changeSelection={changeSelection} claves={claves} activeVisParameters={activeVisParameters}/>:
        <DataConnection parameter={parameter} subparameter={subparameter} updateValues={updateValues} sources={sources} selection={selection} changeSelection={changeSelection} claves={claves}/>
        }
    </li>
    )
}

function DataCard({visParameter, updateValues, sources, deviceStates, activeVisParameters}) {

    const [hasAuto, setHasAuto]=React.useState(false);
    let subparameters;

    if (Array.isArray(visParameter.value)) {
        subparameters=visParameter.value;
    } else {
        subparameters=[visParameter];
    }

    const mapeo=subparameters?.map((param)=>
        <ParameterManager 
            parameter={visParameter.name}
            subparameter={param} 
            sources={sources} 
            updateValues={updateValues} 
            key={param.name} 
            defineAutoParameter={setHasAuto}
            deviceStates={deviceStates}
            activeVisParameters={activeVisParameters}/>);
    // Pasar visParameters a DataCardManager
    return (
    <div className={hasAuto?"accordion-item accordion-custom":"accordion-item"} key={visParameter.name}>
        <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={'#'+visParameter.name.replace(" ", "_")} aria-expanded="false" aria-controls="collapseTwo">
            {visParameter.name}
            </button>
        </h2>
        <div id={visParameter.name.replace(" ", "_")} className="accordion-collapse collapse">
            <div className="accordion-body">
                <ul className="list-group list-group-flush my-n2">
                    {mapeo}
                </ul>
            </div>
        </div>
    </div>
    );
}


export default function DataManagement({deviceStream, updateValues, visParameters, deviceStates, activeVisParameters}) {
    const dataCards = visParameters?.map((parameter)=>(
        <DataCard 
            visParameter={parameter} 
            sources={deviceStream} 
            updateValues={updateValues} 
            key={parameter.name} 
            deviceStates={deviceStates}
            activeVisParameters={activeVisParameters}/>));
    return (
        <div>
            <div className="accordion mt-3 ms-2 me-2 mb-3 custom-scroll">
                {dataCards}
            </div>
        </div>
    );
}