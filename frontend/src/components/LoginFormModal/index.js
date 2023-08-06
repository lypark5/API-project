import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const errorsObj = {};
  
  useEffect(() => {
    if (credential && credential.length < 4) {
      errorsObj.credential = 'Username must be at least 4 characters long'
    };
    if (password && password.length < 6) {
      errorsObj.password = 'Password must be at least 6 characters long'
    };
    setErrors(errorsObj);
  }, [credential.length, password.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  function LoginTheDemoUserFunction() {
    const credential = 'Demo-lition';
    const password = 'password';
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  // line 66 made disabled true if those things are less than the stuff, but when they are met, don't disable the button (make avail the button)
  return (
    <div className='modal' id='login-modal'>
      <h2>Log In</h2>
      {errors.credential && (
        <p className='errors'>{errors.credential}</p>
      )}
      {errors.password && (
        <p className='errors'>{errors.password}</p>
      )}
      <form onSubmit={handleSubmit} id='login-form'>
        <div id='username'>
          <label>
            Username or Email
          </label>
          <input
            className='login-input'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div id='password'>
          <label>
            Password
          </label>
          <input
            className='login-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={credential.length < 4 || password.length < 6 ? true : false} className="red-button">Log In</button>
      </form>
      <button onClick={() => LoginTheDemoUserFunction()}>Demo User</button>
    </div>
  );
}

export default LoginFormModal;