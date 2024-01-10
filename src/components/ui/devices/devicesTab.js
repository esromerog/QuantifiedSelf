import React, { useState } from "react";

import devicesRaw from "../../../metadata/devices";
import { useSelector } from "react-redux";

import { GenericDeviceButton, FileDeviceButton } from "./Buttons/buttons";
import { DeviceConnection } from "./stream_functions/connection_modal";

function DeviceList({ data, name, handleShow, uploaded }) {
  let key = data.heading;
  if (key.includes("LSL")) {
    key = "LSL";
  }

  if (uploaded) {
    key = "Upload";
  }

  const buttonComponent =
    key === "Upload" ? (
      <FileDeviceButton data={data} name={name} handleShow={handleShow} />
    ) : (
      <GenericDeviceButton data={data} name={name} handleShow={handleShow} />
    );

  return (
    <div key={name} className="button-list">
      {buttonComponent}
    </div>
  );
}

export default function RenderDevices() {
  const [show, setShow] = useState(false);
  const [currId, setCurrId] = useState("");

  function handleShow(data) {
    setShow(true);
    setCurrId(data);
  }

  const handleClose = () => setShow(false);

  const deviceMeta = useSelector((state) => state.deviceMeta);

  const deviceButtonList = Object.keys(deviceMeta)?.map((id) => {
    const currDev = deviceMeta[id];
    let data = devicesRaw.find(({ heading }) => currDev.device === heading);
    // Here I could add another option to get data from the store in case it doesn't find it

    if (data == undefined) {
      const defaultData = devicesRaw.find(
        ({ heading }) => currDev?.info?.name === heading
      );
      if (defaultData) {
        data = defaultData;
      } else {
        data = {
          heading:
            currDev?.info?.name != undefined
              ? "LSL - " + currDev?.info?.name
              : "LSL",
          description:
            "This is a custom LSL stream. LSL devices can have very different properties",
          type: currDev?.info?.type || "custom",
          sampling_rate: currDev?.info?.nominal_srate,
        };
      }
    }

    const uploaded = "playing" in deviceMeta[id];

    return (
      <DeviceList
        data={data}
        name={id}
        handleShow={handleShow}
        key={id}
        uploaded={uploaded}
      />
    );
  });

  const deviceName = deviceMeta?.[currId]?.device;

  return (
    <div>
      {deviceButtonList}
      <DeviceConnection
        show={show}
        handleClose={handleClose}
        deviceID={currId}
        deviceName={deviceName}
      />
    </div>
  );
}
