import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import StarsFunction from "../Stars";
import { editReviewThunk } from "../../../store/reviews";
import { getSpotDetailsThunk } from "../../../store/spot";

function EditReviewModalFunction({review1}) {          // we needed to pass in this prop from the main get spot details page in its component.
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const reviewBeingEdited = useSelector(state => state.reviews.spot[review1.id]);  // this is crucial for pre-populating review and stars, we are grabbing it from prev state, it is NOT undefined.
  const thisSpot = useSelector(state => state.spots.singleSpot);
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
    await dispatch(editReviewThunk(review1.id, editedReviewObj));
    await dispatch (getSpotDetailsThunk(reviewBeingEdited.spotId));     // we need this line to rerender and update the specific review on the spot id page, cuz it's a cart that contains the specific cereal and u can't access it just thru details page, gotta go into cart page (get all reviews component)
    closeModal();
  }

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  return (
    <div className="modal">
      <h3>How was your stay at {thisSpot.name}?</h3>
      {error.review && <p className='errors'>{error.review}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          type="textarea"
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className='review-text-box'
        />
        <StarsFunction
          disabled={false}
          onChange={onChange}
          stars={stars}
        />
        <button type="submit" className="red-button">Update Your Review</button>
      </form>
    </div>
  )
}

export default EditReviewModalFunction;