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

  return (
    <div className="modal delete-modal">
      <h3 style={{margin:'15px 0px 0px'}}>Confirm Delete</h3>
      <p style={{marginTop: '7px'}}>Are you sure you want to remove this spot from the listings?</p>
      <button onClick={() => yesDeleteFunction()} className="red-button">Yes (Delete Spot)</button>
      <button onClick={() => closeModal()} className='no-button'>No (Keep Spot)</button>
    </div>
  )
}

export default DeleteSpotModalFunction;