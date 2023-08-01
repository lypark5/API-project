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

  return (
    <>
      <h1>Sign Up</h1>
      {/* {errors.username && (
        <p className='errors'>{errors.username}</p>
      )} */}
      {/* {errors.password && (
        <p className='errors'>{errors.password}</p>
      )} */}
      {/* {errors.email && (
        <p className='errors'>{errors.email}</p>
      )} */}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="errors">{errors.email}</p>}
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="errors">{errors.username}</p>}
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="errors">{errors.firstName}</p>}
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="errors">{errors.lastName}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="errors">{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="errors">{errors.confirmPassword}</p>
        )}
        <button type="submit" disabled={isDisabled()}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;