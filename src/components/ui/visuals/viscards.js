import { useState, React } from 'react'
import { allVisSources } from '../../../App';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function ImageCard({ visSource, defineVisParameters }) {
  const [showAddData, setShowAddData] = useState(false);

  return (
    <div className='col img-holder m-0 mb-1' key={visSource.name}>
      <Link to={"/" + visSource.name + "/devices"} className='w-100 h-100 btn p-0'>
        <img
          className={showAddData ? "img-vis-hover img-vis rounded" : "img-vis rounded"}
          src={visSource.img_name} alt={visSource.name}
          onMouseEnter={() => setShowAddData(true)}
          onMouseLeave={() => setShowAddData(false)} />
      </Link>
      {showAddData ? <div className='centered-over-image' key={visSource.name} onMouseEnter={() => setShowAddData(true)}>
        <h6 className="image-hover-text align-self-center text-center">{visSource.name}</h6>
        <a className="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target={'#' + visSource.name.replace(/\s/g, '')}><i className="bi bi-plus-circle"></i></a>
        <div className="image-hover-text collapse" id={visSource.name.replace(/\s/g, '')}>
          {visSource.description}
        </div>
      </div> : null}
    </div>
  )
}

export default function RenderVisualizationCards() {

  const visSources = allVisSources.map((visSource) => <ImageCard visSource={visSource} key={visSource.name} />);

  return (

    <div className='row mt-2 row-cols-2 g-1'>
      {visSources}
    </div>

  )
}

