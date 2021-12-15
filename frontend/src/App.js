import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [errorState, setErrorState] = useState(false);

  const blogFormRef = useRef();

  const setNotification = message => {
    setMessage(message);
    setTimeout(() => setMessage(''), 5000);
  };

  const setErrorNotification = message => {
    setErrorState(true);
    setMessage(message);
    setTimeout(() => {
      setErrorState(false);
      setMessage('');
    }, 5000);
  };

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );
  }, []);



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginUser = async userObject => {
    try {
      const user = await loginService.loginUser(userObject);
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setNotification(`${user.username} logged in`);
      setUser(user);
    } catch (exception) {
      setErrorNotification('Error logging in. Please check credentials.');
    }
  };

  const submitBlog = async blogObject => {
    try {
      const blog = await blogService.create(blogObject);
      setBlogs(blogs.concat(blog));
      setNotification(
        `Successfully added ${blog.title} by ${blog.author}`
      );
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      setErrorNotification(
        `error creating blog: ${blogObject.title} by ${blogObject.author}`
      );
    }
  };

  const deleteBlog = async blogObject => {
    try {
      await blogService.remove(blogObject);
      setBlogs(blogs.filter(b => b.id !== blogObject.id));
      setNotification(
        `Successfully deleted ${blogObject.title} by ${blogObject.author}`
      );
    } catch (exception) {
      console.log(exception);
      setErrorNotification(
        `error deleting blog: ${blogObject.title} by ${blogObject.author}`
      );
    }
  };

  const addLike = async blogObject => {
    try {
      const blog = await blogService.update(blogObject);
      setBlogs([].concat(blogs));
      return blog;
    } catch (exception) {
      setErrorNotification('Like failed');
      return null;
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken('');
    window.localStorage.removeItem('loggedBlogAppUser');
    setNotification('logged user out');
  };

  const loginForm = () => (
    <Togglable buttonLabel='log in'>
      <LoginForm loginUser={loginUser} />
    </Togglable>
  );

  const blogForm = () => (
    <Togglable buttonLabel='add blog' ref={blogFormRef}>
      <NewBlogForm submitBlog={submitBlog} />
    </Togglable>
  );

  return (
    <>
      <h2>blogs</h2>
      <Notification message={message} isError={errorState} />
      {
        user === null ?
          loginForm() :
          <div>
            <p>{user.username} logged in</p>
            <button onClick={handleLogout}>log out</button>
            {blogForm()}
          </div>
      }
      <div id="blog-list">
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map(blog => <Blog key={blog.id} blog={blog} addLike={addLike} deleteBlog={deleteBlog}/>)}
      </div>
    </>
  );
};

export default App;