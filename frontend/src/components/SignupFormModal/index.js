import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const errorsObj = {};


  useEffect(() => {
    // if (hasSubmitted) {
    if (username && username.length < 4) {
      errorsObj.username = 'Username must be at least 4 characters long'
    };
    if (password && password.length < 6) {
      errorsObj.password = 'Password must be at least 6 characters long'
    };
    // }
    setErrors(errorsObj);
  }, [username.length, password.length]);     // inside dependency array hasSubmitted if u wanna implement it


  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        // .then (()=> setHasSubmitted(true))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const isDisabled = () => {
    if (!email) return true;
    else if (!username) return true;
    else if (!firstName) return true;
    else if (!lastName) return true;
    else if (!password) return true; 
    else if (username.length < 4 || password.length < 6) return true;
    else return false;
  }

  const disabledClassNameFunction = () => {
    if (!email) return 'disabled-review-button';
    else if (!username) return 'disabled-review-button';
    else if (!firstName) return 'disabled-review-button';
    else if (!lastName) return 'disabled-review-button';
    else if (!password) return 'disabled-review-button'; 
    else if (username.length < 4 || password.length < 6) return 'disabled-review-button';
    else return 'submit-review-button';
  }

  return (
    <div className="modal" id='signup-modal'>
      <h2 id='signup-h2'>Sign Up</h2>
      {/* {errors.username && (
        <p className='errors'>{errors.username}</p>
      )} */}
      {/* {errors.password && (
        <p className='errors'>{errors.password}</p>
      )} */}
      {/* {errors.email && (
        <p className='errors'>{errors.email}</p>
      )} */}
      <form onSubmit={handleSubmit} id='signup-form'>
        <div id='input-container'>
          <input
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        {errors.firstName && <p className="errors">{errors.firstName}</p>}

          <input
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        {errors.lastName && <p className="errors">{errors.lastName}</p>}

          <input
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        {errors.email && <p className="errors">{errors.email}</p>}
      
          <input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        {errors.username && <p className="errors">{errors.username}</p>}
               
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        {errors.password && <p className="errors">{errors.password}</p>}
      
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        {errors.confirmPassword && (
          <p className="errors">{errors.confirmPassword}</p>
        )}
        </div>
        <button type="submit" disabled={isDisabled()} className={disabledClassNameFunction()}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;