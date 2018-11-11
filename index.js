require('express-async-errors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
// const winston = require('winston');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');

// winston.add(winston.transports.File, { filename: 'logfile.log' });

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: "jwtPrivateKey" is not set.');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly', 
  { useNewUrlParser: true, useCreateIndex: true, })
  .then(() => console.log('Connected to the vidly DB.'))
  .catch(err => console.error('Error: Could Not Connect.', err.message));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));