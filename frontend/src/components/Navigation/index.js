import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div>
      <span>
        <img src='data:image/png;base64,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' />
      </span>
      <span>
        {sessionUser && (
          <NavLink to="/spots">Create a Spot</NavLink>
        )}
        
        <NavLink exact to="/">Home</NavLink>
        {isLoaded && (

            <ProfileButton user={sessionUser} />
        )}
      </span>

    </div>
  );
}

export default Navigation;