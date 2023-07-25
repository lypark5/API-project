import { useSelector } from "react-redux";

export default function ManageReviewsFunction () {
  const reviewsOfUser = useSelector(state => state.reviews.user)
  console.log('reviewsOfUser =', reveiwsOfUser);
  return (
    <h1>manage reviews page connected</h1>
  )
}