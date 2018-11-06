const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
  .then(() => console.log('Connected to the vidly DB.'))
  .catch(err => console.error('Error: Could Not Connect.', err.message));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));