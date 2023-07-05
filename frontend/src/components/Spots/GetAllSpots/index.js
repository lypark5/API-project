import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { GetAllSpotsThunk } from '../../../store/spot';


// function name must be capitalized
function GetAllSpots () {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.allSpots);
  const spotsArray = Object.values(spots)       // make an obj list into array list

  useEffect(() => {
    dispatch(GetAllSpotsThunk());
  }, [dispatch]);
  console.log('spots =', spots)         // spots is an obj of objs
  console.log('spotsArray =', spotsArray)         
  return (
    <>
      <h1>home~~</h1>
      <div>
        {spotsArray.map(spot => 
          <div>
            <img src={spot.previewImage} />
            <p>{spot.city}, {spot.state}</p>
            <p>${spot.price} night</p>
            <p>{spot.avgRating}</p>
          </div>
          )}
      </div>
    </>
  )
};

export default GetAllSpots;