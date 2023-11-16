import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import LSLReceiver from "../../../utility/lslClient";


export default function LSLConnection({ show, handleClose }) {

    const [success, setSuccess] = useState(null)

    async function handleConnect() {
        const lslClient = new LSLReceiver();

        setSuccess(undefined);
        lslClient.connect("ws://localhost:8333", () => setSuccess(true));
        window.addEventListener('beforeunload', () => lslClient.stop());

        setTimeout(function () {
            if (!lslClient.isConnected) {
                setSuccess(false);
            }
        }, 1000)
    }

    function getConnText() {
        switch (success) {
            case true:
                return {
                    text: "Connected to the stream",
                    class: "text-success"
                }
            case false:
                return {
                    text: "Unable to connect",
                    class: "text-danger"
                }
            case undefined:
                return {
                    text: "Awaiting connection...",
                    class: "text-warning"
                }
            default:
                return {
                    text: "",
                    class: ""
                }
        }
    }

    const connText = getConnText()

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Connect your LSL device</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                This is a custom LSL stream. LSL devices can different properties depending on the device that you connect. To learn more about LSL, view their
                <a className="link-underline link-underline-opacity-0" href="https://github.com/sccn/labstreaminglayer" target="_blank"> repository.</a>
                {/* Here I can add the rest of the content once success is true*/}
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <p className={connText.class}>{connText.text}</p>
                {success ?
                    <div className="text-success mt-1 mb-1">Connected</div> :
                    <button type="button" className="btn btn-outline-dark" onClick={handleConnect} disabled={success}><i className="bi bi-bluetooth me-2"></i>Connect</button>
                }
            </Modal.Footer>
        </Modal>)
}

function EEGCustomization() {
    return (
        <div>
            
        </div>
    )
}