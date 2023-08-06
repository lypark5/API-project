import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpotsThunk } from '../../../store/spot';
import { Link } from 'react-router-dom';
import './GetAllSpots.css'


// function name must be capitalized
function GetAllSpotsFunction() {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.allSpots);
  const spotsArray = Object.values(spots)       // convert an obj list into array list

  useEffect(() => {
    dispatch(getAllSpotsThunk())
  }, [dispatch]);

  // console.log('spots =', spots)         // spots is an obj of objs
  // console.log('spotsArray =', spotsArray)         
  return (
    <div id='container-container'>
      <div className='all-spots-container'>
        {spotsArray.map(spot => 
          <span className='all-spots-card'>
            <Link to={`/spots/${spot.id}`} title={spot.name} className='link'>
                <img src={spot.previewImage} alt={spot.name} className='all-spots-pic'/>
                <div id='bottom-half'>
                  <div id='top-line'>
                    <p id='city-n-state-left'>{spot.city}, {spot.state}</p>
                    <span id='stars-right'>
                      {typeof spot.avgRating === 'number' ? <p>{spot.avgRating.toFixed(1)} ⭐</p> : <p>{spot.avgRating}</p>}
                      {/* {console.log((typeof spot.avgRating), spot.avgRating)} */}
                    </span>
                  </div>
                  <p>${spot.price} night</p>
                </div>
            </Link>
          </span>
        )}
      </div>
    </div>
  )
};

export default GetAllSpotsFunction;