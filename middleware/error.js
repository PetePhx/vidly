const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'errors.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
  exitOnError: true,
});

logger.add(new transports.MongoDB(
  { db: 'mongodb://localhost/vidly', level: 'error', options: { useNewUrlParser: true } })
);

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: format.cli() }));
}

module.exports = function (err, req, res, next) {
  logger.log('error', err.message);
  
  res.status(500).send('something failed.');

  // process.exit(1);
}