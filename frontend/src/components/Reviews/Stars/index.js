import { useEffect, useState } from 'react';
import './Stars.css';

const StarsFunction = ({ stars, disabled, onChange }) => {
  const [activeStars, setActiveStars] = useState(stars);

  useEffect(() => {
    setActiveStars(stars);
  }, [stars]);
  // NOTE: This useEffect isn't necessary to have for this scenario anymore
  // because the number input has been removed, but if you have a scenario which
  // requires this input to be re-rendered with an updated rating prop instead
  // of unmounted and remounted with an updated rating, then this useEffect is
  // necessary.

  return (
    <div className="stars-input">
      <div
        className={activeStars >= 1 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveStars(1)} }
        onMouseLeave={() => { if (!disabled) setActiveStars(stars)} }
        onClick={() => { if (!disabled) onChange(1)} }
      >
        <i className="fa fa-star"></i>
      </div>
      <div
        className={activeStars >= 2 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveStars(2)} }
        onMouseLeave={() => { if (!disabled) setActiveStars(stars)} }
        onClick={() => { if (!disabled) onChange(2)} }
      >
        <i className="fa fa-star"></i>
      </div>
      <div
        className={activeStars >= 3 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveStars(3)} }
        onMouseLeave={() => { if (!disabled) setActiveStars(stars)} }
        onClick={() => { if (!disabled) onChange(3)} }
      >
        <i className="fa fa-star"></i>
      </div>
      <div
        className={activeStars >= 4 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveStars(4)} }
        onMouseLeave={() => { if (!disabled) setActiveStars(stars)} }
        onClick={() => { if (!disabled) onChange(4)} }
      >
        <i className="fa fa-star"></i>
      </div>
      <div
        className={activeStars >= 5 ? "filled" : "empty"}
        onMouseEnter={() => { if (!disabled) setActiveStars(5) }}
        onMouseLeave={() => { if (!disabled) setActiveStars(stars)} }
        onClick={() => { if (!disabled) onChange(5)} }
      >
        <i className="fa fa-star"></i>
      </div>
      &nbsp;&nbsp;Stars
    </div>
  );
};

export default StarsFunction;