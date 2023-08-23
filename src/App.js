import "./App.scss";
import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useSelector } from "react-redux";
import MainVisualsWindow from "./components/ui/visuals/mainVisuals";
import visSourcesImport from './metadata/vis'
import DevicesMainWindow from "./components/ui/devices/mainDevices";

export const allVisSources=visSourcesImport.map(
    (visSource)=>{return {
      name: visSource.name, 
      description: visSource.description, 
      img_name: require(`./assets/${visSource.img_src}`), 
      properties: visSource.properties}});

function App() {

  return (
    <div className="container-fluid full-width h-100">
      <div className="row full-width h-100">
        <div className="col-5 overflow-scroll disable-scrollbar h-100">
          <div className="vertical-spacing ms-5 me-5">
            <DevicesMainWindow />
          </div>
          {/*<div className="d-flex justify-content-end me-5">
          <button className="btn btn-link" alt="Pop into another window" onClick={()=>setToggleOtherScreen(true)}><i className="bi bi-box-arrow-up-right"></i></button></div>*/}
        </div>
        <div className="col-7 full-width h-100 ">
            <MainVisualsWindow />
        </div>
      </div>
    </div>
  );
}

export default App;





/* Manual window management content
function copyStyles(src, dest) {
  Array.from(src.styleSheets).forEach((styleSheet) => {
    const styleElement = styleSheet.ownerNode.cloneNode(true);
    styleElement.href = styleSheet.href;
    dest.head.appendChild(styleElement);
  });
  Array.from(src.fonts).forEach((font) => dest.fonts.add(font));
}

const RenderInWindow = (props) => {
  const [container, setContainer] = useState(null);
  const newWindow = useRef(null);

  useEffect(() => {
    // Create container element on client-side
    setContainer(document.createElement("div"));
    console.log(container);
  }, []);

  useEffect(() => {
    // When container is ready
    if (container) {
      // Create window
      newWindow.current = window.open(
        "",
        "",
        "width=600,height=400,left=800,left=${window.screen.availWidth / 2 - 200},top=${window.screen.availHeight / 2 - 150}"
      );

      copyStyles(window.document, newWindow.current.document);
      // Append container
      newWindow.current.document.body.appendChild(container);

      // Save reference to window for cleanup
      const curWindow = newWindow.current;


      // Return cleanup function
      return () => curWindow.close();
    }
  }, [container]);

  return container && createPortal(props.children, container);
};
*/
