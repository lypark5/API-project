import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import StarsFunction from "../Stars";
import { editReviewThunk } from "../../../store/reviews";

function EditReviewModalFunction({reviewId}) {          // we needed to pass in this prop from the main get spot details page in its component.
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const reviewBeingEdited = useSelector(state => state.reviews.spot[reviewId]);  // this is crucial for pre-populating review and stars
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);

  useEffect(() => {
    if (reviewBeingEdited) {
      setReview(reviewBeingEdited.review);
      setStars(reviewBeingEdited.stars);
    }
  }, [reviewBeingEdited.stars]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editedReviewObj = {review, stars};
    await dispatch(editReviewThunk(reviewId, editedReviewObj));
    closeModal();
  }

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  return (
    <>
      <h3>Edit Review:</h3>
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

export default EditReviewModalFunction;