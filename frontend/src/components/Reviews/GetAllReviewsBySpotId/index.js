// import { useSelector, useDispatch } from 'react-redux';
// import { useEffect } from 'react';
// import { getAllReviewsBySpotIdThunk } from '../../../store/reviews';

// function GetAllReviewsBySpotIdFunction() {
//   const dispatch = useDispatch();
//   const blah = useSelector(state => state.reviews);
//   console.log('blah =', blah)
//   const reviews = useSelector(state => state.reviews.spot);
//   useEffect(() => {
//     dispatch(getAllReviewsBySpotIdThunk())
//   }, [dispatch]);

//   console.log(reviews)
//   return (
//     <div>
//       <h1>all reviewsss</h1>
      
//     </div>
//   )

// }

// export default GetAllReviewsBySpotIdFunction;


////////////////////////////
// attempt to list all reviews
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllReviewsBySpotIdThunk } from '../../../store/reviews';
import { useParams } from 'react-router-dom';
import DeleteReviewModalFunction from '../DeleteReviewModal';
import OpenModalButton from '../../OpenModalButton';
import EditReviewModalFunction from '../EditReviewModal';
import CreateReviewModalFunction from '../CreateReviewModal';

function GetAllReviewsBySpotIdFunction() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const reviewsOfThisSpot = useSelector(state => state.reviews.spot); // = {1: {spotId: 2, review: 'was nice', ...}, 4: {spotId2:, review: 'was bad', ...}}.  these are all reviews of this spot owned by this user.  notice it's {1:{}, 4:{}}.  the key is the reviewId number.  the value is the review object.
  const reviewsOfThisSpotArr = Object.values(reviewsOfThisSpot);      // this converted above var into an array.
  const currentUser = useSelector(state => state.session.user);
  const reviewsOfThisSpotFilteredByCurrentUser = reviewsOfThisSpotArr.filter(review => review.userId === currentUser.id)    // we want:  if this arr is empty, this stuff doesn't exist, we want to give the user the button to create a review for this spot.

  useEffect(() => {
    dispatch(getAllReviewsBySpotIdThunk(spotId))
  }, [dispatch]);

  // bro, u can't use forEach in jsx AT ALL, MUST USE .map
  // line 53, if current user's id matches the review's userId, show the buttons, but if not, don't show.
  // this is where the create review button lives, and this is where we made a prop called spotId, we pass it into the Create reviews component.
  return  (
    <div>
      <h1>all reviewsss</h1>
      {!reviewsOfThisSpotFilteredByCurrentUser.length && 
        <OpenModalButton
          buttonText='Write a Review'
          modalComponent={<CreateReviewModalFunction spotId={spotId}/>}
        />}
      {reviewsOfThisSpotArr.map(review => 
        <div>
          <p>{review.review}</p>
          {currentUser.id === review.userId && 
            <div>
              <OpenModalButton
                buttonText='Edit'
                modalComponent={<EditReviewModalFunction reviewId={review.id}/>}
              />
              <OpenModalButton
                buttonText='Delete'
                modalComponent={<DeleteReviewModalFunction reviewId={review.id}/>}
              />
            </div>}
        </div>
      )}
    </div>
  
  )
}

export default GetAllReviewsBySpotIdFunction;