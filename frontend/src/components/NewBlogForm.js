import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitBlog } from '../reducers/blogReducer';

const NewBlogForm = () => {
  const dispatch = useDispatch();

  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');

  const handleTitleChange = event => {
    setTitle(event.target.value);
  };

  const handleUrlChange = event => {
    setUrl(event.target.value);
  };

  const handleAuthorChange = event => {
    setAuthor(event.target.value);
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    dispatch(submitBlog({ title, author, url }));
    setAuthor('');
    setTitle('');
    setUrl('');
  };

  return (
    <div className="newBlogForm">
      <h2>Create New</h2>
      <form onSubmit={handleFormSubmit}>
        title:<input id="titleInput" type="text" value={title} onChange={handleTitleChange}/>
        <br/>
        author:<input id="authorInput" type="text" value={author} onChange={handleAuthorChange}/>
        <br/>
        url:<input id="urlInput" type="text" value={url} onChange={handleUrlChange}/>
        <br/>
        <button id="blog-create-button" type="submit">create</button>
      </form>
    </div>
  );
};

export default NewBlogForm;