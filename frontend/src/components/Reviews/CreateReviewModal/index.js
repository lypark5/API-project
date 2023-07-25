import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import StarsFunction from "../Stars";
import { createReviewThunk } from "../../../store/reviews";

// component sends shit to the thunk, which sends shit to backend, then sends a complete shit to the thunk, then complete shit to action.
function CreateReviewModalFunction({spotId}) {    // spotId prop we got from GetAllReviewsBySpotId component page, inside CreateReviewModal component.
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [error, setError] = useState({});
  
  useEffect(()=> {
    const errorsObj = {};
    if (review && review.length < 10) {               // if review is being populated (exists) then check if it's less than 10
      errorsObj.review = 'Review must be at least 10 characters long'
    }
    if (!stars) {
      errorsObj.stars = 'You must select a rating'
    }
    setError(errorsObj);
  }, [review.length, stars]);                         // u need stars in dep array as well so the msg can go away once u select a star.
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReviewObj = {review, stars};             // later change this to rating, this is the user input stuff saved in an obj
    await dispatch(createReviewThunk(spotId, newReviewObj));
    closeModal();                                     // do this last cuz gotta wait for the thunk to dispatch so it can register the data to ur store
  }

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  // inside a jsx, inside a component tag, u can pass a prop, such as rating={rating}
  // so lines 36-38 are all props, sent to RatingFunction in Rating component page.
  return (
    <>
      <h3>How was your stay?</h3>
      <p className='errors'>{error.review}</p>
      <p className='errors'>{error.stars}</p>
      
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
        <button type="submit" disabled={review.length < 10 || stars === 0 ? true : false}>Submit Your Review</button>
      </form>
    </>
  )
}

export default CreateReviewModalFunction;