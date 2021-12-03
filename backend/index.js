const app = require('./app');
const http = require('http');
const config = require('./util/config');
const logger = require('./util/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});