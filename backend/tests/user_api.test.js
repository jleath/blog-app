const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});
  const userObjects = helper.initialUsers
    .map(user => new User(user));
  const promises = userObjects.map(user => user.save());
  await Promise.all(promises);
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
});

afterAll(() => {
  mongoose.connection.close();
});