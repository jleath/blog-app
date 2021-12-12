import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewBlogForm from './NewBlogForm';

describe('<NewBlogForm />', () => {
  let submitBlog;
  let component;
  let form;
  let titleInput;
  let authorInput;
  let urlInput;
  beforeEach(() => {
    submitBlog = jest.fn();
    component = render(
      <NewBlogForm submitBlog={submitBlog} />
    );
    titleInput = component.container.querySelector('#titleInput');
    authorInput = component.container.querySelector('#authorInput');
    urlInput = component.container.querySelector('#urlInput');
    form = component.container.querySelector('form');
  });
  test('form submission triggers submitBlog', () => {
    const newBlogInfo = {
      title: 'new blog',
      author: 'j boogie',
      url: 'j-boogz.net',
    };

    fireEvent.change(titleInput, {
      target: { value: newBlogInfo.title }
    });
    fireEvent.change(authorInput, {
      target: { value: newBlogInfo.author }
    });
    fireEvent.change(urlInput, {
      target: { value: newBlogInfo.url }
    });

    fireEvent.submit(form);

    expect(submitBlog.mock.calls).toHaveLength(1);
    expect(submitBlog.mock.calls[0][0].title).toBe(newBlogInfo.title);
    expect(submitBlog.mock.calls[0][0].author).toBe(newBlogInfo.author);
    expect(submitBlog.mock.calls[0][0].url).toBe(newBlogInfo.url);
  });
});