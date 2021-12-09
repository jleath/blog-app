const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

morgan.token('postData', function (req) {return JSON.stringify(req.body);});
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :postData');

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decoded = request.token
    ? jwt.verify(request.token, process.env.SECRET)
    : null;
  if (!request.token || !decoded.id) {
    request.user = null;
  } else {
    request.user = await User.findById(decoded.id);
  }
  next();
};

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
};