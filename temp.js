const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
  .then(() => console.log('Connected to the vidly DB.'))
  .catch(err => console.error('Error: Could Not Connect.', err.message));

const { Genre, genreSchema } = require('./models/genre');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: genreSchema,
  },
  numberInStock: {
    type: Number,
  },
  dailyRentalRate: {
    type: Number,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

async function createMovie() {
  movie = new Movie({
    title: "terminator",
    genre: new Genre({ name: 'Schi-fi'}),
    numberInStock: 0,
    dailyRentalRate: 0,
  });
  await movie.save();
}

createMovie();