import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Sun from '../../visuals/sun';
import Mirrors from "../../visuals/mirrors";
import Bagel from "../../visuals/bagel";
import AudioPlayerWithFilter from "../../visuals/Audio_player";

import RenderVisualizationCards from './viscards'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { allVisSources } from '../../../App';
import { useParams, Link } from 'react-router-dom';


export default function MainVisualsWindow({visMetadata}) {

    const dispatch = useDispatch();

    function defineVisParameters(selection) {
        const v = selection.properties.reduce((acc, parameter) => {
            if (Array.isArray(parameter.value)) {
                acc[parameter.name] = parameter.value.reduce((acc, datos) => { acc[datos.name] = 0; return acc }, {});
            } else {
                acc[parameter.name] = parameter.value;
            }
            return acc;
        }, {});
        dispatch({ type: 'params/set', payload: v });
    }

    const mainMenu = (visMetadata === undefined) ? true : false;
    useEffect(()=>{if (!mainMenu) defineVisParameters(visMetadata)}, [visMetadata]);

    // Need to use useRef to update canvas in-real-time
    const params = useSelector(state => state.params);
    const paramsRef = useRef(params);
    paramsRef.current = params;

    const visStreamFunctions = {
        "Sun Visualization": <Sun value={paramsRef} />,
        "Abstract Colors": <Mirrors value={paramsRef} />,
        "Circle Visualization": <Bagel value={paramsRef} />,
        "Audio player": <AudioPlayerWithFilter value={paramsRef} />,
    };

    const fullScreenHandle = useFullScreenHandle();

    return (
        <div className="h-100">
            <div className="d-flex justify-content-between align-items-center align-text-center mt-1">
                <div className="d-flex align-items-center">
                    {(mainMenu) ? null : <Link to="/home/devices" className="btn btn-link" ><b><i className="bi bi-arrow-left" alt="back"></i></b></Link>}
                    <h4 className="text-left text-transition align-self-center m-0">Visualization</h4>
                </div>
                <div className="d-flex align-items-center">
                    {(mainMenu) ? null : <button className="btn btn-link align-self-center me-3" onClick={fullScreenHandle.enter}><b><i className="bi bi-arrows-fullscreen" alt="full-screen"></i></b></button>}
                </div>
            </div>
            <FullScreen handle={fullScreenHandle} className="full-width h-100">
                <div className={(mainMenu) ? "full-width h-100 overflow-scroll disable-scrollbar" : "full-width h-100"}>
                    {function renderStream() {
                        if (mainMenu) {
                            return <RenderVisualizationCards />;
                        } else if (!(Object.keys(params).length === 0)) {
                            return visStreamFunctions[visMetadata.name]
                        }
                    }()}
                </div>
            </FullScreen>
        </div>
    )
}