import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GetSpotDetailThunk } from '../../../store/spot';

function GetSpotDetail () {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.singleSpot);

  console.log('spot: ', spot)

  useEffect(() => {
    dispatch(GetSpotDetailThunk(spotId));
  }, [dispatch]);

  return (
    <>
      <h1>spot detail</h1>
      <p>{spot.city}</p>
    </>
  )
}

export default GetSpotDetail;

