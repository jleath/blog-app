const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});
  const firstUser = helper.initialUsers[0];
  const passwordHash = await bcrypt.hash(firstUser.password, 10);
  const user = new User({ username: firstUser.username, passwordHash });
  await user.save();
});

describe('user management', () => {
  test('adding a new user returns a 200 status code', async () => {
    const newUser = {
      username: 'newuser',
      name: 'j-boogs',
      password: 'noway',
    };
    const usersAtStart = await helper.usersInDb();
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
  });
  test('adding a username that already exists returns 400', async () => {
    const firstUser = helper.initialUsers[0];
    const usersAtStart = await helper.usersInDb();
    await api
      .post('/api/users')
      .send(firstUser)
      .expect(400);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
  test('adding a user without a name returns a 400', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      name: 'missing username',
      password: 'sekret',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
  test('adding a user with a name less than 3 characters returns a 400', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'no',
      name: 'short username',
      password: 'sekret',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
  test('adding a user without a password returns a 400', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'howdypardner',
      name: 'missing username',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
  test('adding a user with a password less than 3 characters returns a 400', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'longusernameman',
      name: 'short password',
      password: 'se',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
  test('fetch existing users from db', async () => {
    const usersAtStart = await helper.usersInDb();
    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(users.body).toHaveLength(usersAtStart.length);
  });
  test('login a valid user', async () => {
    const existingUser = helper.initialUsers[0];
    const response = await api
      .post('/api/login')
      .send({ username: existingUser.username, password: existingUser.password })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.token).toBeDefined();
  });
  test('login with an incorrect password', async () => {
    const existingUser = helper.initialUsers[0];
    const response = await api
      .post('/api/login')
      .send({ username: existingUser.username, password: existingUser.password + 'BAD' })
      .expect(401);
    expect(response.body.token).toBeUndefined();
  });
  test('login with an invalid username', async () => {
    const existingUser = helper.initialUsers[0];
    const response = await api
      .post('/api/login')
      .send({ username: existingUser.username + 'BAD', password: existingUser.password })
      .expect(401);
    expect(response.body.token).toBeUndefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});