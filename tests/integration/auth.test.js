const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');
let server;
let token;

describe('Auth /api/genres', () => {
  beforeEach(() => {
    server = require('../../index');
    token = (new User()).generateAuthToken();
  });
  
  afterEach(async () => {
    await Genre.deleteMany({});
    server.close();
  });

  const exec = async () => {
    return await request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1'});
  };

  it('should return 401 for no token provided', async () => {
    token = '';

    const response = await exec();

    expect(response.status).toBe(401);
  });

  it('should return 400 for invalid token provided', async () => {
    token = 'hi';

    const response = await exec();

    expect(response.status).toBe(400);
  });
  
  it('should return 200 for valid token', async () => {
    const response = await exec();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('name', 'genre1');
  });
});