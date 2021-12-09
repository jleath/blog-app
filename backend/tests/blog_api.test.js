const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const getValidToken = async () => {
  const username = helper.initialUsers[0].username;
  const password = helper.initialUsers[0].password;
  const loginResponse = await api
    .post('/api/login')
    .send({ username, password });
  return loginResponse.body.token;
};

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

    const token = await getValidToken();

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
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

    const token = await getValidToken();

    await Blog.deleteMany({});
    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(newBlog);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].likes).toBe(0);
  });

  test('saving new blog with no title or url results in 400 Bad Request', async () => {
    const missingInfo = {
      author: 'Mr. Tester',
      likes: 1000,
    };

    const token = await getValidToken();

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${token}`)
      .send(missingInfo)
      .expect(400);
  });
});

describe('deleting items from db', () => {
  let userToken = undefined;
  beforeEach(async () => {
    await Blog.deleteMany({});
    const newUser = {
      username: 'myname',
      password: 'secretpassword',
    };

    await api
      .post('/api/users')
      .send(newUser);

    const loginResponse = await api
      .post('/api/login')
      .send(newUser);

    userToken = loginResponse.body.token;
  });

  test('deleting item without a user token', async () => {
    const id = await helper.saveDummyBlog(api, userToken);
    const blogsAtStart = await helper.blogsInDb();
    await api
      .delete(`/api/blogs/${id}`)
      .expect(401);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });

  test('deleting item with faulty token', async () => {
    const id = await helper.saveDummyBlog(api, userToken);
    const blogsAtStart = await helper.blogsInDb();
    await api
      .delete(`/api/blogs/${id}`)
      .set('authorization', `bearer ${userToken}bad`)
      .expect(401);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });

  test('deleting item with valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const id = await helper.saveDummyBlog(api, userToken);
    await api
      .delete(`/api/blogs/${id}`)
      .set('authorization', `bearer ${userToken}`)
      .expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    const ids = blogsAtEnd.map(b => b.id);
    expect(ids).not.toContain(id);
  });
});

describe('updating a blog in the db', () => {
  test('fails with statuscode 404 if blog does not exist', async () => {
    const newBlogData = {
      author: 'Dr. Tester',
    };
    const id = await helper.nonExistingId();
    await api
      .put(`/api/blogs/${id}`)
      .send(newBlogData)
      .expect(404);
  });

  test('updates blog with valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const newLikes = 123455;
    const id = blogToUpdate.id;
    await api
      .put(`/api/blogs/${id}`)
      .send({ likes: newLikes })
      .expect(200);
    const blogsAtEnd = await helper.blogsInDb();
    blogsAtEnd.forEach(b => {
      if (b.id === id) {
        expect(b.likes).toBe(newLikes);
        expect(b.author).toBe(blogToUpdate.author);
        expect(b.title).toBe(blogToUpdate.title);
        expect(b.url).toBe(blogToUpdate.url);
      }
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});