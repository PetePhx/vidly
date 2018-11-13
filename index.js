require('express-async-errors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const winston = require('winston');
require('winston-mongodb');

require('./startup/routes.js')(app);

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', options: { useNewUrlParser: true } }),
    new winston.transports.File({ filename: 'errors.log' })
  ],
  exceptionHandlers: new winston.transports.File({ filename: 'exceptions.log' }),
});

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: "jwtPrivateKey" is not set.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly', 
  { useNewUrlParser: true, useCreateIndex: true, })
  .then(() => console.log('Connected to the vidly DB.'))
  .catch(err => console.error('Error: Could Not Connect.', err.message));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));