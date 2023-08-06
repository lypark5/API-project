import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id='nav-bar'>
      <span>
        <NavLink exact to="/">
          <img src='https://www.edigitalagency.com.au/wp-content/uploads/airbnb-logo-png-transparent-background.png' id='logo'/>
        </NavLink>
      </span>
      <span id='right-nav-span'>
        {sessionUser && (
          <NavLink to="/spots" className='nav-link'>Create a New Spot</NavLink>
        )}
        {isLoaded && (
            <ProfileButton user={sessionUser} />
        )}
      </span>

    </div>
  );
}

export default Navigation;