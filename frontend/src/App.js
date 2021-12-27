import React, { useEffect } from 'react';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { initializeBlogs } from './reducers/blogReducer';
import { logoutUser } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  const loginForm = () => (
    <Togglable buttonLabel='log in'>
      <LoginForm />
    </Togglable>
  );

  const blogForm = () => (
    <Togglable buttonLabel='add blog'>
      <NewBlogForm />
    </Togglable>
  );

  const notification = useSelector(state => state.notification);
  const blogs = useSelector(state => state.blogs);
  const user = useSelector(state => state.user);

  return (
    <>
      <h2>blogs</h2>
      <Notification message={notification.notification} isError={notification.error} />
      {
        user === null ?
          loginForm() :
          <div>
            <p>{user.username} logged in</p>
            <button onClick={() => dispatch(logoutUser())}>log out</button>
            {blogForm()}
          </div>
      }
      <div id="blog-list">
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map(blog => <Blog key={blog.id} blog={blog} />)}
      </div>
    </>
  );
};

export default App;