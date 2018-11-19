require('express-async-errors');
const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const unhandledExcLogger = createLogger({
  level: 'error',
  exceptionHandlers: [ 
    new transports.File({ filename: 'exceptions.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  unhandledExcLogger.add(new transports.Console({ 
    format: format.cli(),
  }));
}

const logger = createLogger({
  level: 'error',
  format: format.cli(),
  transports: [
    new transports.MongoDB({ db: 'mongodb://localhost/vidly', options: { useNewUrlParser: true } }),
    new transports.File({ filename: 'errors.log' })
  ],
});

module.exports.logger = logger;
module.exports.unhandledExcLogger = unhandledExcLogger;
