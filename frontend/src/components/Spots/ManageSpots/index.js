import { getAllSpotsThunk } from "../../../store/spot";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import DeleteSpotModalFunction from "../DeleteSpotModal";
import OpenModalButton from "../../OpenModalButton";


// useSelector grabs stuff from the new state
function GetAllSpotsOfCurrentFunction () {
  const user = useSelector(state => state.session.user);        // this is logged in user, under new state
  const allSpots = useSelector(state => state.spots.allSpots)     // this is an object of all spots objects {1:{}, 2:{}}
  const allSpotsArr = Object.values(allSpots);                  // converts it to array so we can work with it [{}, {}]
  const dispatch = useDispatch();
  const history = useHistory();
  const userId = user.id;
  const userSpots = allSpotsArr.filter(spot => spot.ownerId === userId);
  
  useEffect (() => {                                        // useEffect runs after loading all the code first, makes it rerender and does it.
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  function editButtonFunction (spotId) {
      history.push(`/spots/${spotId}/edit`)
  }

  // console.log('allSpots =', allSpots)
  // console.log('allSpotsArr =', allSpotsArr)
  // console.log('userSpots =', userSpots)
  // console.log('user =', user)
  // console.log('userId =', userId)
  // modal component line, spotId is prop name variable we gave, to spot.id of each spot from array
  return (
    <>
    <h1>get all spots of current user page</h1>
    {userSpots.map(spot => 
      <div>
        <img src={spot.previewImage} />
        <p>{spot.city}, {spot.state}</p>
        <p>⭐{spot.avgRating}</p>
        <p>${spot.price} night</p>
        <button onClick={() => editButtonFunction(spot.id)}>Update</button>
        <OpenModalButton 
          buttonText='Delete'
          modalComponent={<DeleteSpotModalFunction spotId={spot.id} />}
        />
      </div>
    )}
    </>
  )
}

export default GetAllSpotsOfCurrentFunction;

