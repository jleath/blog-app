import React, { useState } from 'react';

const Blog = ({ blog, addLike, deleteBlog }) => {
  const [visible, setVisible] = useState(false);
  const [numLikes, setNumLikes] = useState(blog.likes);

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
    let newBlog = { ...blog, likes: numLikes + 1 };
    let returnedBlog = await addLike(newBlog);
    if (returnedBlog) {
      setNumLikes(returnedBlog.likes);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm(`Are you sure you want to delete ${blog.title}?`)) {
      deleteBlog(blog);
    }
  };

  return (
    <div style={blogStyle}>
      <h3>{blog.title} -- {blog.author}</h3>
      <button style={hideWhenVisible} onClick={toggleVisibility}>show</button>
      <div className="blogDetails" style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>Likes: {numLikes} <button onClick={handleLikeClick}>like</button></p>
        <button onClick={toggleVisibility}>hide</button>
        <button onClick={handleDeleteClick}>delete</button>
      </div>
    </div>
  );
};

export default Blog;