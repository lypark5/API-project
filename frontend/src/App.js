import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GetAllSpotsFunction from "./components/Spots/GetAllSpots";
import GetSpotDetailsFunction from "./components/Spots/GetSpotDetails";


// i load all my shit here, where i write switch and route
// user only sees path in this file, not backend addresses
// reducer will tell us what next state look like
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && 
        <Switch>
          <Route exact path='/'>
            <GetAllSpotsFunction />
          </Route>
          <Route path='/spots/:spotId'>
            <GetSpotDetailsFunction />
          </Route>
        </Switch>}
    </>
  );
}

export default App;