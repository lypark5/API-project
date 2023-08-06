import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllReviewsBySpotIdThunk } from '../../../store/reviews';
import { useParams } from 'react-router-dom';
import DeleteReviewModalFunction from '../DeleteReviewModal';
import OpenModalButton from '../../OpenModalButton';
import EditReviewModalFunction from '../EditReviewModal';
import CreateReviewModalFunction from '../CreateReviewModal';
import './GetAllReviewsBySpotId.css';

function GetAllReviewsBySpotIdFunction() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const reviewsOfThisSpot = useSelector(state => state.reviews.spot); // = {1: {spotId: 2, review: 'was nice', ...}, 4: {spotId2:, review: 'was bad', ...}}.  these are all reviews of this spot owned by this user.  notice it's {1:{}, 4:{}}.  the key is the reviewId number.  the value is the review object.
  const reviewsOfThisSpotArr = Object.values(reviewsOfThisSpot);      // this converted above var into an array.
  const currentUser = useSelector(state => state.session.user);
  const reviewsOfThisSpotFilteredByCurrentUser = reviewsOfThisSpotArr.filter(review => review.userId === currentUser?.id)    // we want:  if this arr is empty, this stuff doesn't exist, we want to give the user the button to create a review for this spot.
  const thisSpot = useSelector(state => state.spots.singleSpot);

  useEffect(() => {
    dispatch(getAllReviewsBySpotIdThunk(spotId))
  }, [dispatch, reviewsOfThisSpotArr.length]);

  function checkIfUserOwnsSpotFunction() {
    if (!currentUser || currentUser.id === thisSpot.ownerId || reviewsOfThisSpotFilteredByCurrentUser.length) {
      return false;
    } return true;
  }

  function convertDate(date) {
    const cleanDate = date.split('T')[0].split('-')
    console.log('cleanDate =', cleanDate)
    const year = cleanDate[0];
    const monthNum = cleanDate[1];
    const wordMonthObj = {
      '01': 'January', 
      '02': 'February', 
      '03': 'March', 
      '04': 'April', 
      '05': 'May', 
      '06': 'June', 
      '07': 'July', 
      '08': 'August', 
      '09': 'September', 
      '10': 'October', 
      '11': 'November', 
      '12': 'December'
    };
    return (<p id='date'>{wordMonthObj[monthNum]} {year}</p>)
  }

  // bro, u can't use forEach in jsx AT ALL, MUST USE .map
  // line 53, if current user's id matches the review's userId, show the buttons, but if not, don't show.
  // this is where the create review button lives, and this is where we made a prop called spotId, we pass it into the Create reviews component.
  if (!reviewsOfThisSpotArr.length) {
    return (
      <span id='no-reviews-section'>
        {checkIfUserOwnsSpotFunction() && 
          <OpenModalButton
          className='reviews-post-button'
          buttonText='Post Your Review'
          modalComponent={<CreateReviewModalFunction spotId={spotId} />}
        />}
        <p id='be-the-p'>Be the first to post a review!</p>
      </span>
    )
  } else {
    return (
      <>
        
          {checkIfUserOwnsSpotFunction() && 
          <span id='yes-reviews-button-container'>
            <OpenModalButton
              className='reviews-post-button'
              buttonText='Post Your Review'
              modalComponent={<CreateReviewModalFunction spotId={spotId}/>}
          />
          </span>}
        
        <div id='reviews-container'>
          {reviewsOfThisSpotArr.toReversed().map(review => 
            <div id='reviews-item'>



              <div id='review-name-date'>
                <p id='reviewer'>{review.User?.firstName}</p>
                {convertDate(review.createdAt)}
              </div>

              <p id='review'>{review.review}</p>



              {currentUser?.id === review.userId && 
                <span id='edit-delete-buttons-container'>
                  <OpenModalButton
                    className='update-or-delete'
                    buttonText='Edit'
                    modalComponent={<EditReviewModalFunction review1={review}/>}
                  />
                  <OpenModalButton
                    className='update-or-delete'
                    buttonText='Delete'
                    modalComponent={<DeleteReviewModalFunction reviewId={review.id}/>}
                  />
                </span>}


                
            </div>
          )}
        </div>
      </>
  )};
}


export default GetAllReviewsBySpotIdFunction;
