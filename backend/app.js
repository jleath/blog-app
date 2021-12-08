const config = require('./util/config');
const logger = require('./util/logger');
const middleware = require('./util/middleware');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
// const loginRouter = require('./controllers/login');
const userRouter = require('./controllers/users');

logger.info('Connecting to MongoDB');
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch(error => logger.error(error));

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(middleware.requestLogger);
}
app.use('/api/blogs', blogsRouter);
app.use('/api/users', userRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;