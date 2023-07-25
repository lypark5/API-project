import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpotsFunction from "./components/Spots/GetAllSpots";
import GetSpotDetailsFunction from "./components/Spots/GetSpotDetails";
import CreateSpotFunction from "./components/Spots/CreateSpot";
import GetAllSpotsOfCurrentFunction from "./components/Spots/ManageSpots";
import EditSpotFunction from "./components/Spots/EditSpot";
import ManageReviewsFunction from "./components/Reviews/ManageReviews";


// i load all my shit here, where i write switch and route
// user only sees path in this file, not backend addresses
// reducer will tell us what next state look like
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // the route paths should be the paths the user inputs, not the backend paths that have api in it.
  // also we don't need GetAllReviewsBySpotIdFunction cuz it is not used on this page but the spot detail page.  see GetSpotDetails > index.js.
  // line 39 we change it wildly cuz it need to make sense to user
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && 
        <Switch>
          <Route exact path='/'>
            <GetAllSpotsFunction />
          </Route>
          <Route path='/spots/manage'>
            <GetAllSpotsOfCurrentFunction />
          </Route>
          <Route path='/spots/:spotId/edit'>
            <EditSpotFunction />
          </Route>
          <Route path='/spots/:spotId'>
            <GetSpotDetailsFunction />
          </Route>
          <Route path='/spots'>
            <CreateSpotFunction />
          </Route>
          <Route path='/reviews/manage'>
            <ManageReviewsFunction />
          </Route>
        </Switch>}
    </>
  );
}

export default App;