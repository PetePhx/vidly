const request = require('supertest');
const { Rental } = require('../../models/rental');
const { Movie } = require('../../models/movie');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let movie;
  let rental;
  let token;

  beforeEach(async () => {
    server = require('../../index');
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = (new User()).generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
        numberInStock: 10,
        genre: { name: '12345'},
      },
    });
    await rental.save();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      numberInStock: 10,
      genre: { name: '12345'},
    });
    await movie.save();
  });

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };
  
  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await server.close();
  });

  it('should return 401 if client not logged in', async () => {
    token = '';

    const response = await exec();
    
    expect(response.status).toBe(401);
  });

  it('should return 400 if customerId not provided', async () => {
    customerId = '';
    const response = await exec();

    expect(response.status).toBe(400);
  });

  it('should return 400 if movieId not provided', async () => {
    movieId = '';
    const response = await exec();

    expect(response.status).toBe(400);
  });

  it('should return 404 if it can\'t find a rental with the given props', async () => {
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    const response = await exec();

    expect(response.status).toBe(404);
  });

  it('should return 400 if return is already processed', async () => {
    await Rental.findOneAndUpdate({
      'customer._id': customerId,
      'movie._id': movieId,
    }, { dateReturned: Date.now() });

    const response = await exec();

    expect(response.status).toBe(400);
  });

  it('should return 200 if a valid return', async () => {
    const response = await exec();

    expect(response.status).toBe(200);
  });

  it('should set the return date for a valid return', async () => {
    const response = await exec();

    const rentalInDB = await Rental.findOne({ _id: rental._id });
    const diff = Date.now() - rentalInDB.dateReturned; // in milisec

    expect(diff).toBeLessThan(10 * 1000); // 10 sec
  });

  it('should set the rental fee for a valid return', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();    
    await exec();

    const rentalInDb = await Rental.findOne({ _id: rental._id });

    expect(rentalInDb.rentalFee).toBe(14);
  });
  
  it('should increase the movie in stock after a valid return', async () => {
    await exec();

    const movieInDb = await Movie.findOne({ _id: movieId });

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
});