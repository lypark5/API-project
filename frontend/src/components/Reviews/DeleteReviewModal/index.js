import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteReviewThunk } from "../../../store/reviews";

function DeleteReviewModalFunction({reviewId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  async function yesDeleteReviewFunction() {
    await dispatch(deleteReviewThunk(reviewId));
    closeModal();
  }
 
  return (
    <div className="modal">
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to delete this review?</p>
      <button onClick={() => yesDeleteReviewFunction()} className="red-button">Yes (Delete Review)</button>
      <button onClick={() => closeModal()} className="no-button">No (Keep Review)</button>
    </div>
  )
}

export default DeleteReviewModalFunction;