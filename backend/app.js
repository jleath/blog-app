const config = require('./util/config');
const logger = require('./util/logger');
const middleware = require('./util/middleware');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');

logger.info('Connecting to MongoDB');
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch(error => logger.error(error));

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/blogs', blogsRouter);

module.exports = app;