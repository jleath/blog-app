import loginService from '../services/login';
import blogService from '../services/blogs';
import { setSuccess, setError } from './notificationReducer';

const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
let initialUser = null;
if (loggedUserJSON) {
  initialUser = JSON.parse(loggedUserJSON);
  blogService.setToken(initialUser);
}

const userReducer = (state=initialUser, action) => {
  switch (action.type) {
  case 'LOGIN_USER':
    return action.user;
  case 'LOGOUT_USER':
    return null;
  default:
    return state;
  }
};

export const loginUser = userObject => {
  return async dispatch => {
    try {
      const user = await loginService.loginUser(userObject);
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      dispatch(setSuccess(`${user.username} logged in`, 5));
      dispatch({
        type: 'LOGIN_USER',
        user,
      });
    } catch (exception) {
      setError('Error logging in. Please check credentials.', 5);
    }
  };
};

export const logoutUser = () => {
  return async dispatch => {
    blogService.setToken('');
    window.localStorage.removeItem('loggedBlogAppUser');
    setSuccess('logged user out', 5);
    dispatch({
      type: 'LOGOUT_USER'
    });
  };
};

export default userReducer;