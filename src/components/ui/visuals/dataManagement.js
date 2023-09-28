import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'

import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { useSelector, useDispatch } from 'react-redux';
import { allVisSources } from '../../../App';
import { useParams } from 'react-router-dom';

const selectParams = state => state.params;
const selectStream = state => state.dataStream;

function DataManualSlider({ parameter, subparameter, dropDown }) {
    // This function is the list item when it is connected not connected to a datastream
    // It contains the logic to handle changing into manual mode, setting auto-range, and setting the value of the parameter, to the stream value.

    let valor;

    // I can rework this to use the store state.params initial state/default values. 
    // May also loop through the visParameters JSON using the keys of the state.params object
    const params = useSelector(selectParams);

    try {
        if (subparameter === undefined) {
            valor = params[parameter];
        } else {
            valor = params[parameter][subparameter.name];
        }
    } catch {
        valor = 0;
    }

    const dispatch = useDispatch();

    const subparam = (subparameter === undefined) ? parameter : subparameter.name;

    // Defines min and max of slider
    const min = 0;
    const max = 1;

    // Handles updating the values of the slider
    // This is what must be replaced with the action

    const handleInputChange = (e) => {
        dispatch({
            type: 'params/update',
            payload: {
                name1: parameter,
                name2: subparam,
                newValue: e.target.value
            }
        })
    }

    // Handles changing the values of the input
    const handleFormChange = (e) => {
        let formValue = e.target.value;
        if (formValue > max) {
            formValue = max;
        } else if (formValue < min) {
            formValue = min;
        }
        dispatch({
            type: 'params/update',
            payload: {
                name1: parameter,
                name2: subparam,
                newValue: formValue
            }
        })
        e.target.value = formValue;
    }

    return (
        <div className="row justify-content-start">
            <div className={subparameter === undefined ? "col-xxl-2 col-xl-3 col-lg-4" : "col-xxl-3 col-xl-4 col-lg-5"}>
                <div className="input-group">
                    {subparameter === undefined ? null : <span className="input-group-text">{(subparameter === undefined) ? (null) : subparameter.name}</span>}
                    <input type="text" className="form-control" id="valorManualInput" placeholder={valor} value={valor} onChange={handleFormChange}></input>
                </div>
            </div>
            <div className={subparameter === undefined ? 'col-xxl-7 col-xl-6 col-lg-5 align-self-center' : 'col-xxl-6 col-xl-5 col-lg-4 align-self-center'}><input type="range" className="form-range align-self-center" onChange={handleInputChange} id="customRange1" value={valor} step={0.01} min={min} max={max}></input></div>
            <div className='col-1 align-self-center mb-2'>{dropDown}</div>
        </div>
    )
}



function DataAutoSlider({ dataMappings, subparameter, parameter, dropDown }) {
    // This function is the list item when it is connected to a data stream.
    // It contains the logic to handle changing into manual mode, setting auto-range, and setting the value of the parameter, to the stream value.


    const dispatch = useDispatch();
    const stream = useSelector(selectStream);

    // Logic to handle the range tooltip
    const [show, setShow] = useState(false);
    const target = useRef(null);

    // Defines which dataSource is selected
    const select = (subparameter === undefined) ? dataMappings[parameter] : dataMappings[parameter][subparameter.name];

    // This will use the react store with dataStream
    let source; // Extracts the value from that dataSource

    // Logic that fetches the data from the device stream based on your selection in the dropdown
    // I could also change or make this logic more complicated if I end up going for an LSL format in the stream
    try {
        source = stream[select[0]][select[1]];
    } catch (error) {
        source = (subparameter === undefined) ? 0 : subparameter.value;
    }

    // Min & Max values.
    const [min, setMin] = useState(0); // Actual values used by the mapping
    const [max, setMax] = useState(1);
    const [formMin, setFormMin] = useState(0); // Values to be shown when the user edits the form
    const [formMax, setFormMax] = useState(1);

    const [disabled, setDisabled] = useState(false); // Defines if items are disabled (ex, when autoranging)

    function looseFocusMin() {
        // Function to change the min value. Contains logic in case it doesn't follow rules.
        if (parseFloat(formMin) > max) {
            setFormMin(parseFloat(max) - 1);
        }
        if (parseFloat(formMin) === max) {
            setFormMin(parseFloat(max) - 1);
        }
        setMin(formMin);
    }

    function looseFocusMax() {
        // Function to change the max value. Contains logic in case it doesn't follow rules.
        const valor = parseFloat(formMax);
        if (valor < min) {
            setFormMax(parseFloat(min) + 1);
        }
        if (valor === min) {
            setFormMax(parseFloat(min) + 1);
        }
        setMax(parseFloat(formMax));
    }

    function normalizeValue(value, minimum, maximum) {
        const normalizedValue = (value - minimum) / (maximum - minimum);
        return normalizedValue;
    }

    const [buffer, setBuffer] = useState([false]); // Data buffer for autorange

    // Gets called once autorange starts
    async function handleAutoSet() {
        setBuffer([])
        setDisabled(true);
    }

    const subparam = (subparameter === undefined) ? (parameter) : subparameter.name;

    useEffect(() => {
        // Updates the values
        dispatch({
            type: 'params/update',
            payload: {
                name1: parameter,
                name2: subparam,
                newValue: normalizeValue(source, min, max)
            }
        })
    }, [source]);

    useEffect(() => {
        // Actual autorange function.
        if (typeof buffer[0] !== 'boolean') {
            const buff = [...buffer, source];
            setBuffer(buff);
        }
        if (buffer.length > 20) {
            setDisabled(false);

            const minimo = Math.min(...buffer);
            setMin(minimo);
            setFormMin(minimo);

            const maximo = Math.max(...buffer);
            setMax(maximo);
            setFormMax(maximo);

            setBuffer([false])
        }
    }, [source])

    /// function to change the form value
    const formMinChange = useCallback((e) => { setFormMin(e.target.value) }, []);
    const formMaxChange = useCallback((e) => { setFormMax(e.target.value) }, []);
    return (
        <div className="row justify-content-start">
            <div className="col-3">
                <div className="input-group">
                    {subparameter === undefined ? null : <span className="input-group-text">{(subparameter === undefined) ? (null) : subparameter.name}</span>}
                    <input type="text" className="form-control" id="valorManualInput" value={Math.round(source * 1000) / 1000 /*subparameter.value*/} disabled></input>
                </div>
            </div>
            <div className='col-6 align-self-center'>
                <div className="input-group">
                    <span ref={target} className="input-group-text" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>Range</span>
                    <Overlay className="custom-tooltip" target={target.current} show={show} placement="top">
                        {(props) => (
                            <Tooltip id="overlay-example" className="custom-tooltip" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(!show)} {...props}>
                                Define a range of values for the visualization to consider.
                            </Tooltip>
                        )}
                    </Overlay>
                    <div className="form-floating">
                        <input type="text" className="form-control" id="max" placeholder={0} value={Math.round(formMin * 1000) / 1000} onBlur={looseFocusMin} readOnly={disabled} disabled={disabled} onChange={formMinChange}></input>
                        <label htmlFor="max">Min</label>
                    </div>
                    <div className="form-floating">
                        <input type="text" className="form-control" id="max" placeholder={1} value={Math.round(formMax * 1000) / 1000} onBlur={looseFocusMax} readOnly={disabled} disabled={disabled} onChange={formMaxChange}></input>
                        <label htmlFor="max">Max</label>
                    </div>
                    <button className="btn btn-primary" onClick={handleAutoSet} disabled={disabled}>Auto</button>
                </div>
            </div>
            <div className='col-1 align-self-center'>
                {dropDown}
            </div>
        </div>
    )
}


function ParameterDropDown({ claves, parameter, subparameter, dataMappings, setDataMappings, displayName }) {


    const suggestedClass = (option) => {
        // Checks to see if the parameter has a suggested class. If that suggested class is equal to the option, changes styling.
        if ('suggested' in parameter && parameter.suggested === option) {
            return "dropdown-item text-primary";
        } else if (subparameter !== undefined && 'suggested' in subparameter && parameter.suggested === option) {
            return "dropdown-item text-primary";
        } else {
            return "dropdown-item";
        }
    }

    // Display text on the card. Upon creation, it checks the status
    const [display, setDisplay] = useState(() => {
        let disp;
        if (subparameter === undefined) {
            disp = dataMappings[parameter.name];
        } else {
            disp = dataMappings[parameter.name][subparameter.name];
        }
        if (disp === "Manual") disp = [0, "Manual"];
        if (displayName !== undefined) disp = (subparameter.name + ": " + disp[1]);
        else disp = (disp[1]);
        return disp
    });

    // Changes the data source
    function selectNewSource(sourceName) {
        const maps = Object.assign({}, dataMappings);
        if (subparameter !== undefined) {
            maps[parameter.name][subparameter.name] = sourceName;
        } else {
            maps[parameter.name] = sourceName;
        }

        setDataMappings(maps); // Changes datamappings

        // Changes the display text when the data source/dataMappings change
        let disp;
        if (subparameter === undefined) {
            disp = maps[parameter.name];
        } else {
            disp = maps[parameter.name][subparameter.name];
        }
        if (sourceName === "Manual") disp = [0, "Manual"];
        if (displayName !== undefined) setDisplay(subparameter.name + ": " + disp[1]);
        else setDisplay(disp[1]);

    }

    // Changes the color of the button as dataMappings changes
    const dispColor = useMemo(() => (display.includes("Manual")) ? "btn btn-sm btn-outline-dark ms-2" : "btn btn-sm btn-outline-primary ms-2", [dataMappings])

    return (
        <div>
            <button type="button" className={dispColor} data-bs-toggle="dropdown" aria-expanded="false">{display}</button>
            <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => selectNewSource("Manual")}>Manual</button></li>
                {claves.map((option) => {
                    return (
                        <li key={option.device}>
                            <button type="button" className="dropdown-item" data-bs-toggle="dropdown-submenu" data-bs-target="#nested-dropdown" aria-expanded="false">{option.device}</button>
                            <ul className='submenu dropdown-menu' id="nested-dropdown">
                                {option.data.map((data) => {
                                    return (
                                        <li key={data}>
                                            <button className={suggestedClass(data)} onClick={() => selectNewSource([option.device, data])}>
                                                {data}
                                            </button>
                                        </li>)
                                })}
                            </ul>
                        </li>
                    )
                })
                }
            </ul>
        </div>)
}

function ParameterManager({ claves, subparameter, parameter, dataMappings, setDataMappings }) {

    const [manual, setManual] = useState(true) // Track if the parameter/subparameter is using the manual slider

    // Runs every time the mappings are changed. Tracks changes to manual parameter.
    useEffect(() => {
        if (subparameter !== undefined) {
            if (dataMappings[parameter.name][subparameter.name] === "Manual") setManual(true);
            else setManual(false);
        } else {
            if (dataMappings[parameter.name] === "Manual") setManual(true);
            else setManual(false);
        }
    }, [claves])

    // Drop-down buttons to select the devices & update dataMappings
    const [dropDown, setDropDown] = useState();
    useEffect(() => {
        setDropDown(
            <ParameterDropDown
                claves={claves}
                parameter={parameter}
                dataMappings={dataMappings}
                subparameter={subparameter}
                setDataMappings={setDataMappings} />
        )
    }, [claves])

    return (
        <li className="list-group-item py-4 container" key={(subparameter === undefined) ? parameter.name : subparameter.name}>
            {manual ?
                <DataManualSlider
                    parameter={parameter.name}
                    subparameter={subparameter}
                    dropDown={dropDown} /> :
                <DataAutoSlider
                    parameter={parameter.name}
                    subparameter={subparameter}
                    dataMappings={dataMappings}
                    dropDown={dropDown} />
            }
        </li>
    )
}


function DataCard({ visParameter, dataMappings, setDataMappings }) {

    const stream = useSelector(selectStream);
    // claves is the object returned from the getDataStreamKeys that provides the devices & their streams as a list
    const [claves, setClaves] = useState([]);
    useEffect(() => setClaves(getDataStreamKeys(stream)), [Object.keys(stream)])

    // Generates the drop-downs that hold subparameters (if any), provide a slider, and range functions
    const mapeo = () => {
        if (!Array.isArray(visParameter.value)) { // No subparameters
            return <ParameterManager
                claves={claves}
                parameter={visParameter}
                dataMappings={dataMappings}
                setDataMappings={setDataMappings} />;
        } else {
            return visParameter.value?.map((param) =>
                <ParameterManager
                    claves={claves}
                    key={param.name}
                    parameter={visParameter}
                    subparameter={param}
                    dataMappings={dataMappings}
                    setDataMappings={setDataMappings} />);
        }
    }

    const [expanded, setExpanded] = React.useState(false); // Used for styling, checks to see if accordion is collapsed or not

    // This is the external drop-down that is shown on the actual card when collapsed. Create and declare the dropDown menu that contains data mappings. 
    // The difference here is that it will be a mapping in case there are subparametes & it isn't updated as often
    const [dropDown, setDropDown] = useState();
    useEffect(() => setDropDown(!Array.isArray(visParameter.value) ?
        <div className='mt-1 mb-1'>
            <ParameterDropDown
                claves={claves}
                parameter={visParameter}
                dataMappings={dataMappings}
                setDataMappings={setDataMappings} />
        </div> :
        visParameter.value?.map((param) =>
            <div className='mt-1 mb-1' key={param.name}>
                <ParameterDropDown
                    claves={claves}
                    parameter={visParameter}
                    dataMappings={dataMappings}
                    subparameter={param}
                    setDataMappings={setDataMappings}
                    displayName={true} />
            </div>)
    ), [claves, dataMappings])


    return (
        <div className="list-group-item" key={visParameter.name}>
            <div className="d-flex align-items-center pt-1 pb-1" key={visParameter.name}>
                <div>{visParameter.name}</div>
                <div className={expanded ? "btn-map-transition expanded col align-items-right" : "btn-map-transition closed col align-items-right"}>
                    <div className='d-flex justify-content-end flex-wrap'>
                        {!(expanded) ? dropDown : null}
                    </div>
                </div>
                <button
                    className={(expanded) ? "btn btn-link fa-arrow-down open" : "btn btn-link fa-arrow-down close"}
                    type="button" data-bs-toggle="collapse"
                    data-bs-target={'#' + visParameter.name.replace(" ", "_")}
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                    onClick={() => setExpanded(!expanded)}>
                    <i className="bi bi-three-dots-vertical"></i>
                </button>
            </div>
            <div id={visParameter.name.replace(" ", "_")} className="collapse">
                <div>
                    <ul className="list-group list-group-flush">
                        {mapeo()}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function DataManagement() {
    // Some input props: 
    //    activeVisParameters - object that defines the parameters that are being changed by the data stream
    //    visInfo -  the object that contains the selected visualization's metadata
    //    dataStreamObject - contains the data stream in the shape: {Device1: {Metric1: int, Metric2: int}, Device2: ...}


    // dataMappings is an array that contains the parameters of the visualization and describes what they are mapped to:
    //      It has the shape: {Param1: Device Name/Manual, Param2: {Subparam1: Device Name/Manual}}

    let { visID } = useParams();

    const visInfo = allVisSources.find(x => x.name === visID);

    const [dataMappings, setDataMappings] = useState(visInfo.properties?.reduce((acc, datos) => {
        if (Array.isArray(datos.value)) {
            acc[datos.name] = datos.value.reduce((acc, data) => { acc[data?.name] = "Manual"; return acc }, {});
        } else {
            acc[datos.name] = "Manual";
        }
        return acc
    }, {}));

    // Generates the cards with the parameters
    const dataCards = visInfo.properties?.map((parameter) => (
        <DataCard
            visParameter={parameter}
            key={parameter.name}
            dataMappings={dataMappings}
            setDataMappings={setDataMappings} />));

    return (
        <div>
            <h6>{visInfo.name}</h6>
            <div className="list-group">
                {dataCards}
            </div>
        </div>
    );
}


function getDataStreamKeys(dataStreamObject) {
    // Extracts the devices & their variables from the stream to put them into an array
    // Parameters:
    //    dataStreamObject - contains the data stream in the shape: {Device1: {Metric1: int, Metric2: int}, Device2: ...}

    const returnItems = [];
    for (const valor in dataStreamObject) {
        let newObj = {};
        newObj["device"] = valor;
        newObj["data"] = [];
        for (const datos in dataStreamObject[valor]) {
            newObj["data"] = [...newObj["data"], datos];
        }
        returnItems.push(newObj);
    }
    return returnItems;
}