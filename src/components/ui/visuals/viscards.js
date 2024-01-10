import { React } from "react";
import { allVisSources } from "../../../App";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import p5logo from "../../../assets/p5logo.png";
import { Route, Routes } from "react-router-dom";

export function ImageCard({ visSource }) {
  // Represents a single card with the visualizations in the main menu
  const dispatch = useDispatch();
  const paramList = visSource.properties.map((property) => (
    <div
      className="col-auto vis-property me-1 mb-1 p-1 ps-2 pe-2"
      key={property.name}
    >
      {property.name}
    </div>
  ));

  if (paramList.length > 6) {
    paramList.length = 6;
    paramList.push(
      <div className="col-auto vis-property me-1 mb-1 p-1 ps-2 pe-2" key="more">
        ...
      </div>
    );
  }

  return (
    <Link
      to={visSource.id.toString()}
      onClick={() => dispatch({ type: "params/load", payload: visSource })}
      className="card grid-item rounded-0"
      key={visSource.name}
    >
      {visSource.img_name !== undefined && (
        <img
          className="card-img-top rounded-0 p-2"
          src={visSource.img_name}
          alt={visSource.name}
        />
      )}
      <div className="card-body" key={visSource.name}>
        <h5 className="card-title">{visSource.name}</h5>
        <p className="card-text">{visSource.description}</p>
        <h6>Parameters</h6>
        <div className="container row justify-content-start">{paramList}</div>
        <div className="d-flex justify-content-between">
          <div className="p5-card mt-3">
            {visSource["engine"] === "P5" ? (
              <>
                <img src={p5logo} className="m-0 p-0" />
                <small className="m-2">P5.js</small>
              </>
            ) : (
              <small className="m-2">{visSource["engine"]}</small>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function DefaultVisualizations() {
  // Renders all visualization cards

  const visSources = allVisSources.map((visSource) => (
    <ImageCard visSource={visSource} key={visSource.id} />
  ));

  return (
    <div>
        <div className="custom-grid h-100 mt-3">{visSources}</div>
    </div>
  );
}

export function CustomVisualization({ localSources }) {

  let customSources = [];

  if (localSources !== null) {
    const localVisSources = JSON.parse(localSources);
    customSources = localVisSources.map((visSource) => (
      <ImageCard visSource={visSource} key={visSource.id} />
    ));
  }

  return (
    <div>
      <div className="custom-grid h-100 mt-3">{customSources}</div>
    </div>
  );
}
