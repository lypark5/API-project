import { useEffect, useState } from 'react';
import './Rating.css';

const RatingFunction = ({ rating, disabled, onChange }) => {
  const [activeRating, setActiveRating] = useState(rating);

  useEffect(() => {
    setActiveRating(rating);
  }, [rating]);
  // NOTE: This useEffect isn't necessary to have for this scenario anymore
  // because the number input has been removed, but if you have a scenario which
  // requires this input to be re-rendered with an updated rating prop instead
  // of unmounted and remounted with an updated rating, then this useEffect is
  // necessary.

  return (
    <div className="rating-input">
      <div
        className={activeRating >= 1 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveRating(1)} }
        onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
        onClick={() => { if (!disabled) onChange(1)} }
      >
        <i className="fa fa-star"></i>
      </div>
      <div
        className={activeRating >= 2 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveRating(2)} }
        onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
        onClick={() => { if (!disabled) onChange(2)} }
      >
        <i className="fa fa-star"></i>
      </div>
      <div
        className={activeRating >= 3 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveRating(3)} }
        onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
        onClick={() => { if (!disabled) onChange(3)} }
      >
        <i className="fa fa-star"></i>
      </div>
      <div
        className={activeRating >= 4 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveRating(4)} }
        onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
        onClick={() => { if (!disabled) onChange(4)} }
      >
        <i className="fa fa-star"></i>
      </div>
      <div
        className={activeRating >= 5 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveRating(5) }}
        onMouseLeave={() => { if (!disabled) setActiveRating(rating)} }
        onClick={() => { if (!disabled) onChange(5)} }
      >
        <i className="fa fa-star"></i>
      </div>
    </div>
  );
};

export default RatingFunction;