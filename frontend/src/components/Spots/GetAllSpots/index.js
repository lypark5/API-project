import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpotsThunk } from '../../../store/spot';
import { Link } from 'react-router-dom';


// function name must be capitalized
function GetAllSpotsFunction() {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.allSpots);
  const spotsArray = Object.values(spots)       // convert an obj list into array list

  useEffect(() => {
    dispatch(getAllSpotsThunk())
  }, [dispatch]);

  console.log('spots =', spots)         // spots is an obj of objs
  console.log('spotsArray =', spotsArray)         
  return (
    <>
      <h1>home~~</h1>
      <div>
        {spotsArray.map(spot => 
          <Link to={`/spots/${spot.id}`} title={spot.name}>
            <img src={spot.previewImage} />
            <p>{spot.city}, {spot.state}</p>
            <p>${spot.price} night</p>
            {typeof spot.avgRating === 'number' ? <p>{spot.avgRating.toFixed(1)} ⭐</p> : <p>{spot.avgRating}</p>}
            {console.log((typeof spot.avgRating), spot.avgRating)}
          </Link>
          )}
      </div>
    </>
  )
};

export default GetAllSpotsFunction;