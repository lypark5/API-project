import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllReviewsBySpotIdThunk } from '../../../store/reviews';

function GetAllReviewsBySpotIdFunction() {
  const dispatch = useDispatch();
  const blah = useSelector(state => state.reviews);
  console.log('blah =', blah)
  const reviews = useSelector(state => state.reviews.spot);
  useEffect(() => {
    dispatch(getAllReviewsBySpotIdThunk())
  }, [dispatch]);

  console.log(reviews)
  return (
    <>
      <h1>all reviewsss</h1>
    </>
  )

}

export default GetAllReviewsBySpotIdFunction;