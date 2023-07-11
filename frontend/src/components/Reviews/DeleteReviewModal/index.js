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
    <>
      <h3>Delete Review?</h3>
      <button onClick={() => yesDeleteReviewFunction()}>Yes</button>
      <button onClick={() => closeModal()}>No</button>
    </>
  )
}

export default DeleteReviewModalFunction;