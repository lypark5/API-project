import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import StarsFunction from "../Stars";
import { editReviewThunk, getAllReviewsByUserThunk } from "../../../store/reviews";


function EditReviewModalFunction2({reviewId}) {          // we needed to pass in this prop from the main get spot details page in its component.
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const reviewBeingEdited = useSelector(state => state.reviews.user[reviewId]);  // this is crucial for pre-populating review and stars, we are grabbing it from prev state, it is NOT undefined.
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
    await dispatch (editReviewThunk(reviewId, editedReviewObj));
    closeModal();
  }

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  return (
    <>
      <h3>Edit Review:</h3>
      <p className='errors'>{error.review}</p>
      <form onSubmit={handleSubmit}>
        <input
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
        <button type="submit">Edit Review</button>
      </form>
    </>
  )
}

export default EditReviewModalFunction2;