import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpotDetailsThunk } from '../../../store/spot';

function GetSpotDetailsFunction () {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.singleSpot);

  useEffect(() => {
    dispatch(getSpotDetailsThunk(spotId));
  }, [dispatch]);

  if (!spot.SpotImages) {                                     // if SpotImages key doesn't exist in spot
    console.log('in the if statement', spot.SpotImages)
    return null;
  }
  console.log("spot =", spot)
  console.log("spot.SpotImages= ", spot.SpotImages)
  let prevImg;
  let nonPrevImg = spot.SpotImages.filter(img => !img.preview);
  for (let spotImg of spot.SpotImages) {
    console.log('spotImg =', spotImg)
    if (spotImg.preview) {
      prevImg = spotImg.url
    }
  }
  console.log('prevImg =', prevImg)

  return (
    <>
      <h1>{spot.name}</h1>
      <p>{spot.city}, {spot.state}, {spot.country}</p>
      <div>
        <span>
          <img src={prevImg}></img>
        </span>
        <span>
          {nonPrevImg.map(img =>
            <img src={img.url} />
          )}
        </span>
      </div>
      <div>
        <span>
          <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
          <p>

          </p>
        </span>
        <span>
          <div>
            <span><p>${spot.price}</p><p>night</p></span>
            <span><p>⭐{spot.avgRating}</p></span>
          </div>
          <div></div>
        </span>
      </div>
    </>
  )
}

export default GetSpotDetailsFunction;

