const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
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
      },
    });
    await rental.save();
  });

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };
  
  afterEach(async () => {
    await Rental.deleteMany({});
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
});