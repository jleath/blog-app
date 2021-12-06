const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog));
  const promises = blogObjects.map(blog => blog.save());
  await Promise.all(promises);
});

describe('fetching items from db', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('correct number of blogs returned', async () => {
    const res = await api.get('/api/blogs');
    expect(res.body.length).toBe(helper.initialBlogs.length);
  });

  test('blogs have property named id', async () => {
    const res = await api.get('/api/blogs');
    expect(res.body[0].id).toBeDefined();
  });
});

describe('adding new items to db', () => {
  test('post request adds new item to db', async () => {
    const newBlog = {
      title: 'This is a test blog title',
      author: 'Mr. Tester',
      url: 'bigwebsite.com',
      likes: 1000,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map(b => b.title);
    expect(contents).toContain(
      'This is a test blog title'
    );
  });

  test('number of likes defaults to 0', async () => {
    const newBlog = {
      title: 'This is a test blog title',
      author: 'Mr. Tester',
      url: 'bigwebsite.com',
    };
    await Blog.deleteMany({});
    await api.post('/api/blogs').send(newBlog);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].likes).toBe(0);
  });

  test('saving new blog with no title or url results in 400 Bad Request', async () => {
    const missingInfo = {
      author: 'Mr. Tester',
      likes: 1000,
    };

    await api
      .post('/api/blogs')
      .send(missingInfo)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});