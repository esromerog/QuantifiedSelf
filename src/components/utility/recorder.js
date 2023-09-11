
import store from '../../store';
import Papa from 'papaparse';

/*
function DownloadCSV(saveObject) {

    const divRef = React.useRef();

    useEffect(() => {
        const a = document.createElement("a");
        const json = JSON.stringify(saveObject);
        const blob = new Blob([Papa.unparse(json)], {type: "text/csv"});
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = "Data.csv";
        a.text = "Download";
        
        divRef.current.appendChild(a);
    
        // Clean up the 'a' element when the component unmounts
        return () => {
          divRef.current.removeChild(a);
          window.URL.revokeObjectURL(url);
        };
    }, []);

    return <div ref={divRef}></div>
}
*/


function saveToObject(saveObject) {
    // Function to save the React store to an object
    // If I wanted to use session storage look at:
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
    // https://www.geeksforgeeks.org/how-to-persist-redux-state-in-local-storage-without-any-external-library/

    saveObject.push(store.getState().deviceStream);

    // Code to save it to local storage (in case this works better for MindHive)
    // const data = sessionStorage.getItem("data");
    // data.push(store.getState().deviceStream)
    // sessionStorage.setItem("data", data);
    
}
export function subToStore(saveObject) {
    const unsub = store.subscribe(()=>saveToObject(saveObject));
    return unsub
}

export function saveAtInterval(saveObject, interval) {
    const intervalID = setInterval(()=>saveToObject(saveObject), interval)
    return intervalID
}

function autoCSVDownload(saveObject) {
    // CallBackFunction to download a CSV
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const json = JSON.stringify(saveObject);
    const blob = new Blob([Papa.unparse(json)], {type: "text/csv"});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "Data.csv";

    // Creates a hidden <a> object and clicks it
    a.click();
    window.URL.revokeObjectURL(url);
    
}

export function stopRecording(intervalID, saveObject) {
    clearInterval(intervalID);
    // If I used the subToStore, call unsub()
    //unsub();

    autoCSVDownload(saveObject);
    saveObject = [];

    // sessionStorage.removeItem("data");
}



