import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../../store/spot";
import { useModal } from "../../../context/Modal";

function DeleteSpotModalFunction({spotId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  async function yesDeleteFunction() {
    await dispatch(deleteSpotThunk(spotId))   // we need to wait for it to delete before the modal closes
    closeModal();                   // this part closes the modal window after clicking delete button
  }

  function noDeleteFunction() {
    closeModal();
  }

  return (
    <>
      <h3>Confirm Delete</h3>
      <button onClick={() => yesDeleteFunction()}>Yes (Delete Spot)</button>
      <button onClick={() => noDeleteFunction()}>No (Keep Spot)</button>
    </>
  )
}

export default DeleteSpotModalFunction;