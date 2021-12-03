const morgan = require('morgan');
morgan.token('postData', function (req) {return JSON.stringify(req.body);});
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :postData');

module.exports = {
  requestLogger,
};