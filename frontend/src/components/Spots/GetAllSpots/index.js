import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { GetAllSpotsThunk } from '../../../store/spot';


// function name must be capitalized
function GetAllSpots () {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.allSpots);

  useEffect(() => {
    dispatch(GetAllSpotsThunk());
  }, [dispatch]);
  console.log('spots =', spots)
  return (
    <h1>home~~</h1>
  )
};

export default GetAllSpots;