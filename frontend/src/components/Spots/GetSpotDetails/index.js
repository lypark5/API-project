import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpotDetailsThunk } from '../../../store/spot';
import { getAllReviewsBySpotIdThunk } from '../../../store/reviews';
import GetAllReviewsBySpotIdFunction from '../../Reviews/GetAllReviewsBySpotId';

// the review avg and num wasn't updating, so, i needed to trigger a re-render by:
// since getAllReviews and GetSpotDetails work hand in hand, gotta update code for both of em, 
// so we added reviewsOfThisSpot useSelector, and made it an array (to use the length method)
// and then we put it in dependency array with length
function GetSpotDetailsFunction () {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.singleSpot);
  const reviewsOfThisSpot = useSelector(state => state.reviews.spot);   
  const reviewsOfThisSpotArr = Object.values(reviewsOfThisSpot);

  useEffect(() => {
    dispatch(getSpotDetailsThunk(spotId));
  }, [dispatch, reviewsOfThisSpotArr.length]);

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

  while (nonPrevImg.length < 4) {
    nonPrevImg.push({url: 'https://www.beauflor.us/en/products/luxury-vinyl-roll/metro--p--/-/media/sites/ideal/general/nophoto.ashx?as=1&rev=d7c55585b143492bb40a105c8a3554f2&hash=E3318B97D01C0BC7F91476129330E4C4', preview: false})
  }

  console.log('nonPrevImg =', nonPrevImg)

  function yesAvgStarRatingFunction () {
    if (typeof spot.avgStarRating === 'number') {
      return `⭐ ${spot.avgStarRating.toFixed(1)}`
    } else return null;
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
      return '⭐ New'
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
        <span>
          <h3>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
          <p>{spot.description}</p>
        </span>
        <span>
          <span><p>${spot.price} night</p></span>
          <span>
            <p>{yesAvgStarRatingFunction()}{numReviewsStringFunction()}</p>
          </span>
          <button onClick={() => alertFunction()}>Reserve</button>
        </span>
      </div>
      <div>
        <p>{yesAvgStarRatingFunction()}{numReviewsStringFunction()}</p>   
        <GetAllReviewsBySpotIdFunction /> 
      </div>
    </>
  )
}

export default GetSpotDetailsFunction;

