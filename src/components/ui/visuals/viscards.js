import {useState, React} from 'react'
import sunImage from "../../../imgs/sun.png"
import circleImage from "../../../imgs/round.png"

const allVisSources = [
  {
    properties: [
      {name: "Sun Position", value: [{name: "x", value: 0}, {name: "y", value: 0}], suggested: 'Gyro'},
      {name: "Size", value: 0}
    ],
    name: "Sun Visualization",
    description: "2D visualization of a sun rising and setting on a range of mountains. Useful to test simple parameter changes",
    img_name: sunImage
  },
  {
    properties: [
      {name: "Speed Change", value: 0},
    ],
    name: "Abstract Colors",
    description: "Shader-based visualization that resembles a lava-lamp",
    img_name: circleImage
  },
    {
    properties: [
      {name: "Bass source", value: 0},
      {name: "High Pitch source", value: 0},
      {name: "Chimes source", value: 0}
    ],
    name: "Audio player",
    img_name: circleImage
  }
]

function ImageCard({visSource, defineVisParameters}) {
  const [showAddData, setShowAddData]=useState(false);

  return (
    <div className='col img-holder m-0 mb-1' key={visSource.name}>
      <button className='w-100 h-100 btn p-0' onClick={()=>defineVisParameters(visSource)}>
        <img className={showAddData?"img-vis-hover img-vis rounded":"img-vis rounded"} src={visSource.img_name} alt={visSource.name} onMouseEnter={()=>setShowAddData(true)} onMouseLeave={()=>setShowAddData(false)}/></button>
        {showAddData?<div className='centered-over-image' key={visSource.name} onMouseEnter={()=>setShowAddData(true)}>
          <h6 className="image-hover-text align-self-center text-center">{visSource.name}</h6>
          <a className="btn btn-link"  type="button" data-bs-toggle="collapse" data-bs-target={'#'+visSource.name.replace(/\s/g, '')}><i className="bi bi-plus-circle"></i></a>
        <div className="image-hover-text collapse" id={visSource.name.replace(/\s/g, '')}>
          {visSource.description}
        </div>
        </div>:null}
    </div>
  )
}

export default function RenderVisualizationCards({setVisParameters, setSelectedVisParams, setMainMenu}) {
  function defineVisParameters(selection){
    setVisParameters((selection.properties.reduce((acc, parameter)=>{
      if (Array.isArray(parameter.value)) {
        acc[parameter.name]=parameter.value.reduce((acc, datos)=>{acc[datos.name]=0; return acc}, {});
      } else {
        acc[parameter.name]=parameter.value;
      }
      return acc;
    }, {})));
    setSelectedVisParams(selection);
    setMainMenu(false);
  }
  const visSources=allVisSources.map((visSource)=><ImageCard visSource={visSource} defineVisParameters={defineVisParameters} key={visSource.name}/>);
  return (

      <div className='row mt-2 row-cols-2 g-1'>
      {visSources}
      </div>

  )
}

