import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  style,        // dan told me
  id,           //    these are optional props we pass into the generic button on the component page
  className     
  // so after doing lines 9-11, and editing line 22, go over to GetAllReviews component.  
  // line 8 in getAllReviews:
  /*
    <OpenModalButton
      className='update-or-delete'           <-- i added this
      buttonText='Edit'
      modalComponent={<EditReviewModalFunction reviewId={review.id}/>}
    />
  */
  // then go over to css of getAllReviews: make a class of update-or-delete and style it.

}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };
  // ternary if there is no classname, use this default one on line 21.
  return <button onClick={onClick} className={className? className:'open-modal-button'} id={id} style={style}>{buttonText}</button>;  // dan: add these optional props we can use later.
}                                                                                                                                 // is there a given className value in the component page?  if not, use generic 'open-modal-button' className, which i already css'd universally in index.css.

export default OpenModalButton;