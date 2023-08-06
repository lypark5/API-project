import { getAllSpotsThunk } from "../../../store/spot";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useHistory, NavLink, Link } from "react-router-dom";
import DeleteSpotModalFunction from "../DeleteSpotModal";
import OpenModalButton from "../../OpenModalButton";
import './ManageSpots.css';


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
    <div id='manage-container-container'>
      <div id='manage-title-container'>
       <h2>Manage Your Spots</h2>
      </div>



      <div id='manage-spots-container'>

        {userSpots.length ? userSpots.map(spot => 
          <span id='manage-spots-master-card'>
            <div id='same-card-as-get-all'>
              <Link to={`/spots/${spot.id}`} title={spot.name} className='link'>
                <img src={spot.previewImage} alt={spot.name} className='all-spots-pic'/>
                <div className='bottom-half'>
                  <div className='top-line'>
                    <p className='all-spots-p'>{spot.city}, {spot.state}</p>
                    <span id='stars-right'>
                      {typeof spot.avgRating === 'number' ? <p className='all-spots-p'>{spot.avgRating.toFixed(1)} ⭐</p> : <p className='all-spots-p'>{spot.avgRating}</p>}   
                    </span>
                  </div>
                  <p className='all-spots-p'>${spot.price} night</p>
                </div>
              </Link>
            </div>


            <div id='manage-buttons-container'>
              <button onClick={() => editButtonFunction(spot.id)}>Update</button>
              <OpenModalButton 
                buttonText='Delete'
                modalComponent={<DeleteSpotModalFunction spotId={spot.id} />}
              />
            </div>

          </span>
          ) : <NavLink to="/spots" className='nav-link'>Create a New Spot</NavLink>}

      </div>


    </div>
  )
}

export default GetAllSpotsOfCurrentFunction;

