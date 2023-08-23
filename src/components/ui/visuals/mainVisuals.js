import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Sun from '../../visuals/sun';
import Mirrors from "../../visuals/mirrors";

import RenderVisualizationCards from './viscards'
import visSourcesImport from '../../../metadata/vis'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { allVisSources } from '../../../App';

export default function MainVisualsWindow() {


    const dispatch = useDispatch();
    const visMetadata=useSelector(state=>state.visMetadata);

    // Need to use useRef to update canvas in-real-time
    const params=useSelector(state=>state.params);
    const paramsRef=useRef(params);
    paramsRef.current=params;
    const visStreamFunctions = {
        "Sun Visualization": <Sun value={paramsRef}/>,
        "Abstract Colors": <Mirrors value={paramsRef}/>,
    };

    const fullScreenHandle = useFullScreenHandle();
    const mainMenu=("name" in visMetadata)?false:true;

    function returnToMainMenu() {
        dispatch({type: "params/set", payload: {params: {}, visMetadata: {}}})
    }
    
    return (
        <div className="h-100">
            <div className="d-flex justify-content-between align-items-center align-text-center mt-1">
                <div className="d-flex align-items-center">
                    {(mainMenu) ? null : <button className="btn btn-link" onClick={returnToMainMenu}><b><i className="bi bi-arrow-left" alt="back"></i></b></button>}
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