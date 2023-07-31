import {useState, React} from 'react'
import sunImage from "/Users/esromerog/Desktop/Test/example2/src/imgs/sun.png"
import circleImage from "/Users/esromerog/Desktop/Test/example2/src/imgs/round.png"

const allVisSources = [
  {
    properties: [
      {name: "Sun Position", value: 0},
      {name: "Size", value: 0}
    ],
    name: "Sun Visualization",
    img_name: sunImage
  },
  {
    properties: [
      {name: "Delta Speed", value: 0},
    ],
    name: "Abstract Colors",
    img_name: circleImage
  }
]

function ImageCard({visSource, defineVisParameters}) {
  const [showAddData, setShowAddData]=useState(false);
  return (
    <div className='col img-holder' key={visSource.name}>
      <button className='btn w-100 h-100' onClick={()=>defineVisParameters(visSource)}><img className="img-vis rounded" src={visSource.img_name} alt={visSource.name} onMouseEnter={()=>setShowAddData(true)} onMouseLeave={()=>setShowAddData(false)}/></button>
      {showAddData?<div className='centered-over-image' key={visSource.name}><h6 style={{color: "#1A1A1A"}}>{visSource.name}</h6></div>:null}
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
    <div className="container text-center">
      <div className='row row-cols-2'>
      {visSources}
      </div>
    </div>
  )
}