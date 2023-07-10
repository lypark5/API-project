import { useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../../context/Modal";
import RatingFunction from "../Rating";


function CreateReviewModalFunction({spotId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [rating, setRating] = useState(0);
  console.log("spotId =", spotId)
  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  const onChange = (number) => {
    setRating(parseInt(number));
  };

  return (
    <>
      <h3>Write a Review</h3>
      <form>
        <input
          type="textarea"
          placeholder="Leave your review here..."
        />
        <RatingFunction
          disabled={false}
          onChange={onChange}
          rating={rating}
        />
        <button type="submit">Create Review</button>
      </form>
    </>
  )
}

export default CreateReviewModalFunction;