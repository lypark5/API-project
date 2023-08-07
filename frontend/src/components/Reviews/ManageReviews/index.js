import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllReviewsByUserThunk } from "../../../store/reviews";
import OpenModalButton from "../../OpenModalButton";
import DeleteReviewModalFunction from "../DeleteReviewModal";
import EditReviewModalFunction2 from "../EditReviewModalForManage";
import './ManageReviews.css';

export default function ManageReviewsFunction () {
  const reviewsOfUser = useSelector(state => state.reviews.user)
  // console.log('reviewsOfUser =', reviewsOfUser);            // {7:{review:'ddd'}, 10:{review:'eee'}, 11:{review:'fff'}}
  const reviewsOfUserArr = Object.values(reviewsOfUser);    
  // console.log('reviewsOfUserArr =', reviewsOfUserArr);      // [{}, {}, {}]  just the inside stuffs
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllReviewsByUserThunk())
  }, [dispatch]);
  
  function convertDate(date) {
    const cleanDate = date.split('T')[0].split('-')
    // console.log('cleanDate =', cleanDate)
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
    return (<p className='date'>{wordMonthObj[monthNum]} {year}</p>)
  }

  // problem: we delete review, it is not reflected on this page, but is deleted from db.  rerendering issue.
    // we know it's a rerender issue cuz when we refresh page, it is correctly reflected.
  return (
    <div className='manage-container-container'>
      <div id='manage-review-title-container'>
        <h2 style={{marginBottom: '0px'}}>Manage Your Reviews</h2>
      </div>
      <div id='manage-reviews-container' style={{width: '80%'}}>
      {reviewsOfUserArr.toReversed().map(review => 
        <div id='manage-reviews-item'>
          <div className='review-name-date'>
            <p className='reviewer'>{review.Spot.name}</p>
            {convertDate(review.createdAt)}
          </div>
          <p className='review'>{review.review}</p>
          <div className='edit-delete-buttons-container'>
            <OpenModalButton
              className='update-or-delete'
              buttonText='Edit'
              modalComponent={<EditReviewModalFunction2 review1={review} />}
            />
            <OpenModalButton
              className='update-or-delete'
              buttonText='Delete'
              modalComponent={<DeleteReviewModalFunction reviewId={review.id}/>}
            />
          </div>
        </div>
      )}
      </div>
    </div>
    

  )
}