import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSpotDetailsThunk } from '../../../store/spot';
import { getAllReviewsBySpotIdThunk } from '../../../store/reviews';
import GetAllReviewsBySpotIdFunction from '../../Reviews/GetAllReviewsBySpotId';
import './GetSpotDetails.css';

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

  console.log('this is "spot" detail', spot);           // this one shows full obj with rating and imgs and stuff

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

  function yesAvgStarRatingFunction () {            // callback function
    if (typeof spot.avgStarRating === 'number') {
      return `⭐ ${spot.avgStarRating.toFixed(1)}`
    } else return null;
  }

  function numReviewsStringFunction () {            // callback function: formatting of how to show "# review/s"
    if (spot.numReviews) {
      if (spot.numReviews === 1) {                  // only 1 review exists
        return ' · 1 review'
      }
      if (spot.numReviews > 1) {
        return ` · ${spot.numReviews} reviews`      // normal many reviews
      }
    } else {
      return '⭐ New'                               // no reviews
    }
  }

  function alertFunction () {                       // callback function: this does the popup alert msg.
    return alert ('Feature Coming Soon...');
  }



  // line 53 ternary to make the review word singular if 1.
  return (
    // <div id='try'>
    <div id='spot-details-meat-container'>
      <div id='spot-header'>
        <h2 id='spot-title'>{spot.name}</h2>
        <p>{spot.city}, {spot.state}, {spot.country}</p>
      </div>
      <div id='all-pics-container'>
        <span id='big-pic-container'>
          <img src={prevImg} id='big-pic'></img>
        </span>
        <span id='small-pic-container'>          
          {nonPrevImg.map(img =>
            <img src={img.url} className='small-pic'/>
          )}
        </span>
      </div>
      <div id='spot-detail-midsection'>
        <span id='hosted-by-section'>
          <h2 id='hosted-by-title'>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <p>{spot.description}</p>
        </span>
        <span id='reserve-box'>
          <div id='reserve-box-text-line'>
            <span id='price-per-night-left'><p id='big-price'>${spot.price}</p><p>&nbsp;&nbsp;night</p></span>
            <span>
              <p>{yesAvgStarRatingFunction()}{numReviewsStringFunction()}</p>
            </span>
          </div>
          <button onClick={() => alertFunction()} className='red-button'>Reserve</button>
        </span>
      </div>
      <div id='rating-and-quantity-section'>
        <p id='large-stars-n-reviews'>{yesAvgStarRatingFunction()}{numReviewsStringFunction()}</p>   
      </div>
      <div id='get-all-reviews-section'>
        <GetAllReviewsBySpotIdFunction /> 
      </div>
    </div>
    // </div>
  )
}

export default GetSpotDetailsFunction;

