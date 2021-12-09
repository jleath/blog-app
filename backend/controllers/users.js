const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const body = request.body;
  const username = body.username;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    response.status(400).json({ error: 'user with that username already exists' });
  }

  if (!body.password || body.password.length < 3) {
    response.status(400).json({ error: 'password must be at least 3 characters' });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 });
  response.json(users);
});

usersRouter.get('/:id', async (request, response) => {
  const user = await User
    .findById(request.params.id)
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 });
  if (user) {
    response.json(user);
  } else {
    response.status(400).end();
  }
});

module.exports = usersRouter;