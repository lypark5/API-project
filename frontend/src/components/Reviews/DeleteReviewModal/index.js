import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";

function DeleteReviewModalFunction({reviewId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <>
      <h3>Delete Review?</h3>
      <button>Yes</button>
      <button>No</button>
    </>
  )
}

export default DeleteReviewModalFunction;