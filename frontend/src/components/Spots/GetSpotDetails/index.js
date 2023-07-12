import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpotDetailsThunk } from '../../../store/spot';
import { getAllReviewsBySpotIdThunk } from '../../../store/reviews';
import GetAllReviewsBySpotIdFunction from '../../Reviews/GetAllReviewsBySpotId';

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
  // console.log("spot =", spot)
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

  function yesAvgStarRatingFunction () {
    if (typeof spot.avgStarRating === 'number') {
      return `⭐ ${spot.avgStarRating.toFixed(1)}`
    }
  }

  function numReviewsStringFunction () {
    if (spot.numReviews) {
      if (spot.numReviews === 1) {
        return ' · 1 review'
      }
      if (spot.numReviews > 1) {
        return ` · ${spot.numReviews} reviews`
      }
    } else {
      return null
    }
  }

  function alertFunction () {
    return alert ('Feature Coming Soon...');
  }

  // line 53 ternary to make the review word singular if 1.
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
        <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
        <GetAllReviewsBySpotIdFunction />
        <div>
          <span>
            <span><p>${spot.price} night</p></span>
            <span>
              <p>{yesAvgStarRatingFunction() ? yesAvgStarRatingFunction() : spot.avgStarRating}{numReviewsStringFunction()}</p>
            </span>
            <button onClick={() => alertFunction()}>Reserve</button>
          </span>
        </div>
      </div>
    </>
  )
}

export default GetSpotDetailsFunction;

