require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');

const unhandledExcLogger = winston.createLogger({
  level: 'error',
  exceptionHandlers: new winston.transports.File({ filename: 'exceptions.log' }),
});

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', options: { useNewUrlParser: true } }),
    new winston.transports.File({ filename: 'errors.log' })
  ],
});

module.exports.logger = logger;
module.exports.unhandledExcLogger = unhandledExcLogger;
