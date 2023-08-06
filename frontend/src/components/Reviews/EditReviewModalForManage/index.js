import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import StarsFunction from "../Stars";
import { editReviewThunk, getAllReviewsByUserThunk } from "../../../store/reviews";


function EditReviewModalFunction2({review1}) {          // we needed to pass in this prop from the main get manage spots js component.
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const reviewBeingEdited = useSelector(state => state.reviews.user[review1.id]);  // this is crucial for pre-populating review and stars, we are grabbing it from prev state, it is NOT undefined.
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [error, setError] = useState({});

  useEffect(() => {
    const errorsObj = {};
    if (!review) {
      errorsObj.review = 'Review is required'
    }
    if (review && review.length < 10) {               // if review is being populated (exists) then check if it's less than 10
      errorsObj.review = 'Review must be at least 10 characters long'
    }
    // don't need stars if statement error cuz stars is already populated from creation.
    setError(errorsObj);
  }, [review.length])

  console.log('reviewBeingEdited =', reviewBeingEdited);
  useEffect(() => {
    if (reviewBeingEdited) {                        // prepopulation
      setReview(reviewBeingEdited.review);
      setStars(reviewBeingEdited.stars);
    }
  }, []);        // we don't need dep array stuff cuz the modal just pops up with modal prev state stuff.     

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editedReviewObj = {review, stars};
    await dispatch (editReviewThunk(review1.id, editedReviewObj));
    closeModal();
  }

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  return (
    // <div className='modal'>
    //   <h3>How was your stay at {review1.Spot.name}</h3>
    //   {error.review && <p className='errors'>{error.review}</p>}
    //   <form onSubmit={handleSubmit}>
    //     <textarea
    //       type="textarea"
    //       placeholder="Leave your review here..."
    //       value={review}
    //       onChange={(e) => setReview(e.target.value)}
    //     />
    //     <StarsFunction
    //       disabled={false}
    //       onChange={onChange}
    //       stars={stars}
    //     />
    //     <button type="submit" className="red-button">Update Your Review</button>
    //   </form>
    // </div>

    <div className="modal create-review-modal">
    <h2 className='review-header'>How was your stay at <br></br>{review1.Spot.name}?</h2>
    <div className='review-errors-basket'>
      {error.review && <p className='errors review-errors'>{error.review}</p>}
    </div>
    <form onSubmit={handleSubmit} className='review-form'>
      <textarea
        className='review-textarea'
        type="textarea"
        placeholder="Leave your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <StarsFunction
        disabled={false}
        onChange={onChange}
        stars={stars}
      />
      <button className={review.length < 10 || stars === 0 ? 'disabled-review-button' : 'submit-review-button'} type="submit" disabled={review.length < 10 || stars === 0 ? true : false}>Update Your Review</button>
    </form>
  </div>


  )
}

export default EditReviewModalFunction2;