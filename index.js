require('express-async-errors');
const express = require('express');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const winston = require('winston');
require('winston-mongodb');
require('./startup/routes.js')(app);
require('./startup/db')();

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

process.on('unhandledRejection', (exc) => { throw(exc) });

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: "jwtPrivateKey" is not set.');
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));