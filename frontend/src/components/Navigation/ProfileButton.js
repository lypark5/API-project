import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink, useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/');                  // u need this, cuz if u a demo user and u were just at manage page, u try to log out, breaks website cuz u have no user id, so redirect back to home and it'll fix the error breakage.
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  // navlink route i already wrote the one i wanted in app.js to there.
  // line 51 is conditionally displaying if there is a user.  if not, display from line 63 instead.
  return (
    <>
      <button onClick={openMenu} id='profile-button'>
        <div id='profile-button-icon-container'>        
          <i class="fas fa-bars fa-lg"></i>
          <i className="fas fa-user-circle fa-lg" />
        </div>

      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <div id='drop-down-menu'>
            <p className='dropdown-p'>Hello, {user.firstName}</p>
            <p className='dropdown-p' id='dropdown-email'>{user.email}</p>
            <NavLink to='/spots/manage' onClick={() => closeMenu()} className='nav-link manage-link'>Manage Spots</NavLink>
            <NavLink to='/reviews/manage' onClick={() => closeMenu()} className='nav-link manage-link'>Manage Reviews</NavLink>
            <button onClick={logout} id='logout-button'>Log Out</button>
          </div>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;