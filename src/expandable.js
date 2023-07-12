import React from 'react';
import Accordion from 'react-bootstrap/Accordion';


function Listas({texto, titulo, icon}) {
  return (
    /*
    <Accordion.Item eventKey={titulo} key={titulo}>
      <Accordion.Header key={titulo}>
        <i className={icon}></i>{titulo}
      </Accordion.Header>
      <Accordion.Body>{texto}</Accordion.Body>
    </Accordion.Item>
    */
  <div className="accordion-item" key={titulo}>
    <h2 className="accordion-header">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={'#'+titulo.replace(/\s/g, '')} aria-expanded="false">
        {titulo}
      </button>
    </h2>
    <div id={titulo.replace(/\s/g, '')} className="accordion-collapse collapse">
      <div className="accordion-body">
        {texto}
      </div>
    </div>
  </div>
  );
}

export default function Expand({data}) {
  const devicesList=data?.map((datos) => <Listas texto={datos.content} titulo={datos.heading} icon={datos.icon}/>);
  return (
    <div className="accordion" id="accordionExample">
      {devicesList}
    </div>
  );
};