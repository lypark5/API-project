import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../../store/spot";
import { useModal } from "../../../context/Modal";

function DeleteSpotModalFunction({spotId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  async function random() {
    await dispatch(deleteSpotThunk(spotId))   // we need to wait for it to delete before the modal closes
    closeModal();                   // this part closes the modal window after clicking delete button
  }

  return (
    <>
      <h1>this is delete</h1>
      <button onClick={() => random()}>anyText</button>
    </>
  )
}

export default DeleteSpotModalFunction;