import React, { useEffect, useRef, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { createRoot } from "react-dom/client";

import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { allVisSources } from "../../../App";
import { useParams, useNavigate } from "react-router-dom";
import { CodeEditor } from "./codeEditor";
import P5Visuals from "./P5Visuals";
import DataManagement from "./dashboard/dataManagement";
import SplitPane, {
  SplitPaneLeft,
  SplitPaneRight,
  Divider,
} from "../../utility/SplitPane";
import downloadCode from "../../utility/codeDownload";

export function MainView() {
  // This function bridges the left pane (code editor/parameters) with the visualization

  const { visID } = useParams();

  function getVisMeta() {
    let result = allVisSources.find(({ id }) => id == visID);
    if (typeof result === "undefined") {
      const customVis = JSON.parse(localStorage.getItem("visuals"));
      result = customVis.find((x) => x.id == visID);
    }
    return result;
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
      });
    } else if ("custom" in visMetadata) {
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
    const visMeta = localStorage.getItem("visuals");
    let prevIDs = [];
    if (visMeta !== null) {
      savedData = JSON.parse(visMeta);
      prevIDs = savedData.map(({ id }) => id);
    }

    // Generate new metadata that doesn't include the image and has a different ID
    let newID;
    do {
      newID = Math.floor(Math.random() * 1000) + 10;
    } while (prevIDs.includes(newID));

    const newMeta = {
      name: visName,
      description: `Custom visualization based on the ${visName}`,
      engine: "P5",
      id: newID,
      properties: visMetadata.properties,
      custom: true,
    };

    // Push the new metadata and save it
    savedData.push(newMeta);
    localStorage.setItem("visuals", JSON.stringify(savedData));
    localStorage.setItem(`visuals/${newID}`, code);
    // Navigate in the browser to the new ID
    navigate(`/visuals/${newID}`);
    setCustom(true);
    setVisMetadata(newMeta);
    setStartCustomizing(true);
  }

  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(
      "fake-route",
      document.title,
      window.location.href
    );
    window.addEventListener("popstate", () => {
      navigate("/visuals", { replace: true });
    });
  }, [visMetadata]);

  function nameVis(e) {
    // Check if it's an empty value
    if (e.target.value == "") {
      e.target.value = visName;
      return;
    }

    const newName = e.target.value;

    // Retrieve data from local storage and assign it to a new object
    const prevData = JSON.parse(localStorage.getItem("visuals"));
    const newMeta = JSON.parse(JSON.stringify(visMetadata));
    newMeta.name = newName;

    // Get the previous data and remove the old visName from it
    const newData = prevData.filter((item) => item.name !== visName);
    newData.push(newMeta); // Push the new vis into it
    // Set that new vis into the localStorage
    localStorage.setItem("visuals", JSON.stringify(newData));

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

    const prevData = JSON.parse(localStorage.getItem("visuals"));

    // Get the previous data and remove the old visName from it
    const newData = prevData.filter((item) => item.id != visID);
    localStorage.setItem("visuals", JSON.stringify(newData));
  }

  const [popupVisuals, setPopupVisuals] = useState(false);

  return (
    <div className="h-100">
      <div className="d-flex justify-content-between align-items-center align-text-center mt-1">
        <div className="d-flex align-items-center">
          <div className="align-self-center me-3">
            {visMetadata.engine == "P5" ? (
              !custom ? (
                <button
                  className="btn btn-outline-primary align-items-center rounded-0 edit-button ms-1"
                  onClick={startEditing}
                >
                  <i className="bi bi-pencil-fill"></i> Edit
                </button>
              ) : (
                <button
                  className={`btn btn-link edit-button text-start ${
                    dispCode ? "active" : ""
                  }`}
                  onClick={() => setDispCode(!dispCode)}
                >
                  <b>
                    <i className="bi bi-code-slash" alt="code"></i>
                  </b>
                </button>
              )
            ) : null}
          </div>
        </div>
        {startCustomizing ? (
          <input
            type="text"
            className={`h4 m-0 align-self-center invisible-input text-center w-100`}
            placeholder={visName}
            onBlur={nameVis}
          ></input>
        ) : (
          <h4 className="align-self-center m-0 text-center">
            {visMetadata.name}
          </h4>
        )}
        <div className="d-flex justify-content-end w-double">
          {custom ? (
            <button
              className="btn btn-link"
              onClick={deleteCurrentVis}
              alt="Delete"
            >
              <i className="bi bi-trash"></i>
            </button>
          ) : null}
          {visMetadata.engine === "P5" &&
          <button
            className="btn btn-link "
            onClick={() => setPopupVisuals(!popupVisuals)}
          >
            <b>
              <i className="bi bi-window" alt="full-screen"></i>
            </b>
          </button>}
          <button className="btn btn-link " onClick={fullScreenHandle.enter}>
            <b>
              <i className="bi bi-arrows-fullscreen" alt="full-screen"></i>
            </b>
          </button>
        </div>
      </div>
      <SplitPane className="split-pane-row">
        <SplitPaneLeft>
          {dispCode ? (
            <CodePane visName={visName} setCode={setCode} code={code} />
          ) : (
            <DataManagementWindow
              visInfo={visMetadata}
              custom={custom}
              setVisInfo={setVisMetadata}
            />
          )}
        </SplitPaneLeft>
        <Divider />
        <SplitPaneRight>
          <VisualsWindow
            code={code}
            visMetadata={visMetadata}
            fullScreenHandle={fullScreenHandle}
            popupVisuals={popupVisuals}
            setPopupVisuals={setPopupVisuals}
          />
        </SplitPaneRight>
      </SplitPane>
    </div>
  );
}

function CodePane({ code, setCode, visName }) {
  // This is the component that contains the code pane
  return (
    <div className="h-100" style={{ backgroundColor: "#1A1A1A" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h5
          className="ms-2 p-2 pt-3 align-self-center"
          style={{ color: "white", backgroundColor: "#1A1A1A" }}
        >
          Code
        </h5>
        <button
          className="btn btn-link"
          onClick={() => downloadCode(visName, code)}
        >
          <i className="bi bi-download code-download"></i>
        </button>
      </div>
      <CodeEditor code={code} setCode={setCode} />
    </div>
  );
}

function DataManagementWindow({ setVisInfo, visInfo, custom }) {
  // The window with th data mappings
  return (
    <div className="h-100 ms-5 me-5 overflow-auto disable-scrollbar">
      <h5 className="mt-5">Data Mappings</h5>
      <p>Map the parameters to the data received from your device.</p>
      <DataManagement
        visInfo={visInfo}
        custom={custom}
        setVisInfo={setVisInfo}
      />
    </div>
  );
}

function SecureVisualsWindow({ code, params }) {
  const iframeRef = useRef(null);

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const errorScript = `
  window.addEventListener("error", ({ error }) => {
    console.log(error);
    var display = document.getElementById("error-display");
    display.innerText = error.message;
  });
  `;

  const receiveValues = `
  var data = ${JSON.stringify(params)};
  window.addEventListener("message", (event)=>{
    if (event.origin === "${window.location.origin}") {
      data = JSON.parse(event.data);
    }
  })
  `;

  useEffect(() => {
    if (iframeRef.current != null) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(paramsRef.current)
      );
    }
  }, [params]);

  useEffect(() => {
    const source = /* html */ `
    <html>
    <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/addons/p5.sound.js"></script>
      <style>
        body {
          margin: 0px;
          padding:0px;
          height: 100vh;
          width: 100vw;
        }
        * {
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>
      <span id="error-display"></span>
      <script>${receiveValues}</script>
      <script>${errorScript}</script>
      <script>${code}</script>
    </body>
    </html>
    `;
    iframeRef.current.srcdoc = source;
  }, [code]);

  return (
    <iframe
      id="visFrame"
      title="embedded-visualization"
      ref={iframeRef}
      className="h-100 w-100"
    />
  );
}

function PopupComponent({ params, code, children, setPopupVisuals }) {
  const popupRef = useRef(null);

  useEffect(() => {
    // Create a new window and assign it to popupRef.current
    popupRef.current = window.open(
      "",
      "_blank",
      `width=${window.innerWidth / 2}, height=${window.innerHeight}`
    );
    popupRef.current.document.title = "Visualization";
    popupRef.current.addEventListener("unload", () => setPopupVisuals(false));

    const styleElement = popupRef.current.document.createElement("style");

    // Set the CSS rules
    styleElement.textContent = `
      body {
        margin: 0px;
        padding:0px;
        height: 100vh;
        width: 100vw;
      }

      * {
        overflow: hidden;
      }
  
      div {
        width: 100vw;
        height: 100vh;
      }
      .h-100 {
        height: 100vh;
      }
      .w-100 {
        width: 100vw;
      }
    `;

    // Append the <style> element to the <head>
    popupRef.current.document.head.appendChild(styleElement);

    var rootDiv = popupRef.current.document.createElement("div");
    popupRef.current.document.body.appendChild(rootDiv);

    const root = createRoot(rootDiv);
    root.render(children);

    // Cleanup function
    return () => {
      root.unmount();
      popupRef.current.removeEventListener("unload", () => setPopupVisuals(false))
      popupRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (popupRef.current != null) {
      // Use popupRef.current instead of popupRef.current.contentWindow
      popupRef.current.opener.postMessage(
        JSON.stringify({ params, code }),
        window.location.origin
      );
    }
  }, [params, code]);
}

function PopupVisuals({ secureOrigin, initialCode, initialParams}) {
  const [params, setParams] = useState(initialParams);
  const [code, setCode] = useState(initialCode);

  function receiveEvent(event) {
    console.log(event);
    if (event.origin === secureOrigin) {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch (e) {
        msg = {params, code}
      }
      setParams(msg.params);
      setCode(msg.code);
    }
  }

  useEffect(() => {
    window.addEventListener("message", receiveEvent);
    return () => {
      window.removeEventListener("message", receiveEvent);
    };
  }, []);

  return (
    <div className="h-100 w-100">
      <SecureVisualsWindow params={params} code={code} />
    </div>
  );
}

function VisualsWindow({ visMetadata, code, fullScreenHandle, popupVisuals, setPopupVisuals }) {
  // Window with the visuals. It loads and manages the React components that enter
  const params = useSelector((state) => state.params);

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const [component, setComponent] = useState(null);

  useEffect(() => {
    // The following function imports components that are not P5.js visuals by using the default export
    async function importComponent() {
      // All components are places in this path
      const module = await import(
        `../../../assets/visuals/${visMetadata.path}`
      );
      const CustomComponent = module.default;
      setComponent(<CustomComponent value={paramsRef} />);
    }

    // Checks engine to see if it should handle it as a P5.js visualization
    if (visMetadata.engine != "P5") {
      importComponent();
    }
  }, [code]);

  return (
    <div className={`${popupVisuals ? "d-none" : "h-100 w-100"}`}>
      {!popupVisuals && (
        <FullScreen handle={fullScreenHandle} className="w-100 h-100">
          <div className="w-100 h-100">
            {params && visMetadata.engine === "P5"?(
              <SecureVisualsWindow
                code={code}
                params={params}
                popupVisuals={popupVisuals}
              />
            ):component}
          </div>
        </FullScreen>
      )}
      {popupVisuals && (
        <PopupComponent params={params} code={code} setPopupVisuals={setPopupVisuals}>
          <PopupVisuals
            secureOrigin={window.location.origin}
            initialCode={code}
            initialParams={params}
          />
        </PopupComponent>
      )}
    </div>
  );
}
