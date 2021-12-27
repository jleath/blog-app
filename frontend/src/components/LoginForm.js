import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { loginUser } from '../reducers/userReducer';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser({ username, password }));
    setUsername('');
    setPassword('');
  };

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="username">username</label>
        <input id="username-input" type="text" name="username"
          value={username} onChange={handleUsernameChange} />
        <br/>
        <label htmlFor="password">password</label>
        <input id="password-input" type="password" name="password"
          value={password} onChange={handlePasswordChange} />
        <br/>
        <button id="login-button" type="submit">login</button>
      </form>
    </>
  );
};

export default LoginForm;