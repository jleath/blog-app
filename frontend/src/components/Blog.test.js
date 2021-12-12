import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;
  let addLike;
  let deleteBlog;
  const blog = {
    title: 'my blog',
    author: 'me',
    url: 'mysite.com',
    likes: 1000,
  };

  beforeEach(() => {
    addLike = jest.fn();
    deleteBlog = jest.fn();
    component = render(
      <Blog blog={blog} addLike={addLike} deleteBlog={deleteBlog} />
    );
  });

  test('renders title and author by default', () => {
    expect(component.container).toHaveTextContent(blog.title);
    expect(component.container).toHaveTextContent(blog.author);
  });

  test('url and likes hidden by default', () => {
    const div = component.container.querySelector('.blogDetails');
    expect(div).toHaveStyle('display: none');
    expect(div).toHaveTextContent(blog.url);
    expect(div).toHaveTextContent(blog.likes);
  });

  test('url and likes are displayed when the show button is clicked', () => {
    const button = component.getByText('show');
    fireEvent.click(button);
    const div = component.container.querySelector('.blogDetails');
    expect(div).not.toHaveStyle('display: none');
  });

  test('url and likes are hidden again when hide button is clicked', () => {
    fireEvent.click(component.getByText('show'));
    fireEvent.click(component.getByText('hide'));
    const div = component.container.querySelector('.blogDetails');
    expect(div).toHaveStyle('display: none');
  });

  test('clicking like button triggers addLike', () => {
    const likeButton = component.getByText('like');
    fireEvent.click(likeButton);
    expect(addLike.mock.calls).toHaveLength(1);
  });
});