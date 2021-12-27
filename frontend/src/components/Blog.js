import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteBlog, addLike } from '../reducers/blogReducer';

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? '' : 'none' };
  const hideWhenVisible = { display: visible ? 'none' : '' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLikeClick = async () => {
    dispatch(addLike(blog));
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Are you sure you want to delete ${blog.title}?`)) {
      dispatch(deleteBlog(blog));
    }
  };

  return (
    <div style={blogStyle}>
      <h3>{blog.title} -- {blog.author}</h3>
      <button style={hideWhenVisible} onClick={toggleVisibility}>show</button>
      <div className="blogDetails" style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>Likes: {blog.likes} <button className="like-button" onClick={handleLikeClick}>like</button></p>
        <button onClick={toggleVisibility}>hide</button>
        <button className="delete-button" onClick={handleDeleteClick}>delete</button>
      </div>
    </div>
  );
};

export default Blog;