import React, { useState } from 'react'

/*
function dataCard({parameterName, subparameters}) {

    function dataManualSlider ({ subparameters }) {
        
    }

    return (
    <div className="accordion-item" key={titulo}>
        <h2 className="accordion-header">
        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={'#'+titulo.replace(/\s/g, '')} aria-expanded="false">
            {titulo}
        </button>
        </h2>
        <div id={titulo.replace(/\s/g, '')} className="accordion-collapse collapse">
        <div className="accordion-body">
            {texto}
        </div>
        </div>
    </div>
    );
}
*/
export default function DataManagement(deviceStates) {
    const [valor, setValue] = useState(0);
    
    function handleFormChange(e) {
        setValue(e.target.value);
    }

    return (
        <div>
            <label for="customRange1" class="form-label">Example range</label>
            <input type="range" class="form-range" onChange={handleFormChange} id="customRange1"></input>
            {valor}
        </div>
    );
}