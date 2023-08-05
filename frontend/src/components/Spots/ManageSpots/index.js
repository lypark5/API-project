import { getAllSpotsThunk } from "../../../store/spot";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useHistory, NavLink, Link } from "react-router-dom";
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
  // need to keep update and delete buttons outside of link so that it doesn't redirect to spot id page when modal pops up and then crashes with error cuz it doesn't exist.
  // if keeping it bad, after clicking delete, the page is blank cuz this spot id page no longer exists.  
  // good way, it doesn't redirect cuz it's no longer under Link path.
  return (
    <>
    <h1>Manage Your Spots</h1>
    
    {userSpots.length ? userSpots.map(spot => 
    <>
      <Link to={`/spots/${spot.id}`} title={spot.name}>
        <img src={spot.previewImage} />
        <p>{spot.city}, {spot.state}</p>
        <p>⭐{spot.avgRating}</p>
        <p>${spot.price} night</p>
      </Link>
      <button onClick={() => editButtonFunction(spot.id)}>Update</button>
      <OpenModalButton 
        buttonText='Delete'
        modalComponent={<DeleteSpotModalFunction spotId={spot.id} />}
      />
    </>
    ):<NavLink to="/spots" className='nav-link'>Create a New Spot</NavLink>}
    </>
  )
}

export default GetAllSpotsOfCurrentFunction;

