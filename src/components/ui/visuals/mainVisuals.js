import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSelector } from "react-redux";

import RenderVisualizationCards from './viscards'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { allVisSources } from '../../../App';
import { useParams, useNavigate, UNSAFE_NavigationContext } from 'react-router-dom';
import { CodeEditor } from './codeEditor';
import P5Visuals from './P5Visuals';
import DataManagement from './dataManagement';
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '../../utility/SplitPane';
import downloadCode from '../../utility/codeDownload';


export function MainMenu() {
    return (
        <div className="h-100 center-margin overflow-scroll disable-scrollbar">
            <div className="center-margin text-center align-items-center">
                <h4 className="mt-5 mb-2">Visuals</h4>
                <p>These are some of the visuals we have made or selected. <br></br>Feel free to modify the code, create your own visual or explore.</p>
            </div>
            <div>
                <RenderVisualizationCards />
            </div>
        </div>)
}

export function MainView() {

    const { visID } = useParams();

    function getVisMeta() {
        let result = allVisSources.find(({ id }) => id == visID);
        if (typeof result === "undefined") {
            const customVis = JSON.parse(localStorage.getItem('visuals'));
            result = customVis.find((x) => x.id == visID);
        }
        return result
    }

    const [visMetadata, setVisMetadata] = useState(getVisMeta());

    const [visName, setVisName] = useState(visMetadata?.name);

    const [custom, setCustom] = useState("custom" in visMetadata);
    const [startCustomizing, setStartCustomizing] = useState(false);


    // Load the visualizations from the local storage
    const [dispCode, setDispCode] = useState(false);

    const [code, _setCode] = useState("");

    function getCode() {
        if (visMetadata?.code) {
            import(`../../../assets/visuals/p5/${visMetadata.code}`).then((res) => {
                setCode(res.default);
            })
        }
        else if ("custom" in visMetadata) {
            const customVisuals = localStorage.getItem(`visuals/${visID}`);
            setCode(customVisuals);
        } else {
            setCode("");
        }
    }

    function setCode(str) {
        localStorage.setItem(`visuals/${visID}`, str);
        _setCode(str);
    }


    useEffect(getCode, [visMetadata]);
    const fullScreenHandle = useFullScreenHandle();

    function startEditing() {
        let savedData = [];
        const visMeta = localStorage.getItem('visuals');
        let prevIDs = [];
        if (visMeta !== null) {
            savedData = JSON.parse(visMeta);
            prevIDs = savedData.map(({ id }) => id);
        }

        // Generate new metadata that doesn't include the image and has a different ID
        let newID;
        do {
            newID = Math.floor(Math.random() * 1000) + 10
        } while (prevIDs.includes(newID));

        const newMeta = {
            "name": visName,
            "description": `Custom visualization based on the ${visName}`,
            "engine": "P5",
            "id": newID,
            "properties": visMetadata.properties,
            "custom": true,
        }

        // Push the new metadata and save it
        savedData.push(newMeta);
        localStorage.setItem('visuals', JSON.stringify(savedData));
        localStorage.setItem(`visuals/${newID}`, code);
        // Navigate in the browser to the new ID
        navigate(`/visuals/${newID}`);
        setCustom(true);
        setVisMetadata(newMeta);
        setStartCustomizing(true);
    }

    const navigate = useNavigate();

    useEffect(() => {
        window.history.pushState('fake-route', document.title, window.location.href);
        window.addEventListener('popstate', () => {
            navigate("/visuals", { replace: true })
        })
    }, [visMetadata])


    function nameVis(e) {

        // Check if it's an empty value
        if (e.target.value == "") {
            e.target.value = visName;
            return
        }

        const newName = e.target.value;

        // Retrieve data from local storage and assign it to a new object
        const prevData = JSON.parse(localStorage.getItem('visuals'));
        const newMeta = JSON.parse(JSON.stringify(visMetadata));
        newMeta.name = newName;

        // Get the previous data and remove the old visName from it
        const newData = prevData.filter((item) => item.name !== visName);
        newData.push(newMeta) // Push the new vis into it
        // Set that new vis into the localStorage
        localStorage.setItem('visuals', JSON.stringify(newData));

        setVisMetadata(newMeta);
        // Change the name
        setVisName(newName);
    }

    function deleteCurrentVis() {
        if (!window.confirm("Do you really want to delete the current vis?")) {
            return;
        }
        navigate("/visuals", { replace: true });
        localStorage.removeItem(`visuals/${visID}`);

        const prevData = JSON.parse(localStorage.getItem('visuals'));

        // Get the previous data and remove the old visName from it
        const newData = prevData.filter((item) => item.id != visID);
        localStorage.setItem('visuals', JSON.stringify(newData));
    }

    return (
        <div className='h-100'>
            <div className="d-flex justify-content-between align-items-center align-text-center mt-1">
                <div className="d-flex align-items-center">
                    <div className='align-self-center me-3'>
                        {(!custom) ?
                            <button className="btn btn-outline-primary align-items-center rounded-0 edit-button ms-1" onClick={startEditing}>
                                <i className="bi bi-pencil-fill"></i> Edit
                            </button> :
                            <button className={`btn btn-link edit-button text-start ${(dispCode ? "active" : "")}`} onClick={() => setDispCode(!dispCode)}>
                                <b><i className="bi bi-code-slash" alt="code"></i></b>
                            </button>
                        }
                    </div>
                </div>
                {(startCustomizing) ?
                    <input type="text" className={`h4 m-0 align-self-center invisible-input text-center w-100`} placeholder={visName} onBlur={nameVis}></input> :
                    <h4 className="align-self-center m-0 text-center">{visMetadata.name}</h4>
                }
                <div className='d-flex justify-content-end w-double'>
                    {(custom) ?
                        <button className='btn btn-link' onClick={deleteCurrentVis} alt="Delete"><i className="bi bi-trash"></i></button>
                        : null
                    }
                    <button className="btn btn-link " onClick={fullScreenHandle.enter}><b><i className="bi bi-arrows-fullscreen" alt="full-screen"></i></b></button>
                </div>
            </div>
            <SplitPane className="split-pane-row">
                <SplitPaneLeft>
                    {(dispCode) ?
                        <div className='h-100' style={{ backgroundColor: '#1A1A1A' }} >
                            <div className='d-flex justify-content-between align-items-center'>
                                <h5 className='ms-2 p-2 pt-3 align-self-center' style={{ color: 'white', backgroundColor: '#1A1A1A' }}>Code</h5>
                                <button className='btn btn-link' onClick={()=>downloadCode(visName,code)}><i className='bi bi-download code-download'></i></button>
                            </div>
                            <CodeEditor code={code} setCode={setCode} />
                        </div> :
                        <DataManagementWindow visInfo={visMetadata} custom={custom} setVisInfo={setVisMetadata} />
                    }
                </SplitPaneLeft>
                <Divider />
                <SplitPaneRight>
                    <VisualsWindow visMetadata={visMetadata} fullScreenHandle={fullScreenHandle} code={code} />
                </SplitPaneRight>
            </SplitPane>
        </div>
    )
}

function DataManagementWindow({ setVisInfo, visInfo, custom }) {

    return (
        <div className="h-100 ms-5 me-5 overflow-auto disable-scrollbar">
            <h5 className='mt-5'>Data Mappings</h5>
            <p >Map the parameters to the data received from your device.</p>
            <DataManagement visInfo={visInfo} custom={custom} setVisInfo={setVisInfo} />
        </div>
    )
}


function VisualsWindow({ visMetadata, code, fullScreenHandle }) {


    const params = useSelector(state => state.params);

    const paramsRef = useRef(params);
    paramsRef.current = params;

    
    const [component, setComponent] = useState(null);

    useEffect(()=>{
        async function importComponent() {
            // Declare in visMetadata the other visualizations and put a path. Also set engine to something different than P5
            const module = await import(`../../../assets/visuals/${visMetadata.path}`);
            console.log(module);
            const CustomComponent = module.default
            setComponent(<CustomComponent value={paramsRef} />);
        }

        if (visMetadata.engine != "P5") {
            importComponent()
        } else {
            setComponent(<P5Visuals code={code} value={paramsRef} />)
        }
    }, [code])

    return (
        <div className="h-100 w-100">
            <FullScreen handle={fullScreenHandle} className="w-100 h-100">
                <div className="w-100 h-100">
                    {params && component}
                </div>
            </FullScreen>
        </div>
    )
}