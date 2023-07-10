import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";

function EditReviewModalFunction({reviewId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
  }


  return (
    <>
      <h3>Edit Review:</h3>
      <form>
        <input
          type="textarea"
          placeholder="Leave your review here..."
        />
        <input
          type="range"
          min="0"
          max="5"
        />
        <button type="submit">Edit Review</button>
      </form>
    </>
  )
}

export default EditReviewModalFunction;