import blogService from '../services/blogs.js';
import { setError, setSuccess } from './notificationReducer';

const blogReducer = (state=[], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data;
  case 'SUBMIT_BLOG':
    return [...state, action.data];
  case 'DELETE_BLOG':
    return state.filter(b => b.id !== action.blogId);
  case 'LIKE_BLOG':
    return [...state.filter(b => b.id !== action.newBlog.id), action.newBlog];
  default:
    return state;
  }
};

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    });
  };
};

export const submitBlog = blogObject => {
  return async dispatch => {
    try {
      console.log(blogObject);
      const blog = await blogService.create(blogObject);
      dispatch(setSuccess(`Successfully added ${blog.title} by ${blog.author}`, 5));
      dispatch({
        type: 'SUBMIT_BLOG',
        data: blog,
      });
    } catch (exception) {
      dispatch(setError(
        `error creating blog: ${blogObject.title} by ${blogObject.author}`,
        5
      ));
    }
  };
};

export const deleteBlog = blogObject => {
  return async dispatch => {
    try {
      await blogService.remove(blogObject);
      dispatch(setSuccess(
        `Successfully deleted ${blogObject.title} by ${blogObject.author}`,
        5
      ));
      dispatch({
        type: 'DELETE_BLOG',
        blogId: blogObject.id,
      });
    } catch (exception) {
      dispatch(setError(
        `error deleting blog: ${blogObject.title} by ${blogObject.author}`,
        5
      ));
    }
  };
};

export const addLike = blogObject => {
  return async dispatch => {
    try {
      const newBlog = {
        ...blogObject,
        likes:blogObject.likes + 1,
      };
      await blogService.update(newBlog);
      dispatch(setSuccess(
        `Liked ${newBlog.title} by ${newBlog.author}`,
        5
      ));
      dispatch({
        type: 'LIKE_BLOG',
        blogId: blogObject.id,
        newBlog,
      });
    } catch (exception) {
      dispatch(setError('Like failed'));
    }
  };
};

export default blogReducer;