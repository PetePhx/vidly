const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
      ]);
      
      const response = await request(server).get('/api/genres');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.some(gnr => gnr.name === 'genre1')).toBeTruthy();
      expect(response.body.some(gnr => gnr.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return the correct genre', async () => {
      let genre = new Genre({ name: 'genre1' });
      await genre.save();
      // await Genre.collection.insertOne({ _id: 1, name: 'genre1' });
      const response = await request(server).get(`/api/genres/${genre._id}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('genre1');
    });

    it('should return 404 if invalid id passed', async () => {
      const response = await request(server).get('/api/genres/123456');
      expect(response.status).toBe(404);
      expect(response.text).toMatch(/invalid id/i);
    });
  });

  describe('POST /', () => {
    let token;
    let name;

    beforeEach(() => {
      token = (new User()).generateAuthToken();
      name = 'genre1';
    });

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: name });
    };
    
    it('should return 401 if client not logged in', async () => {
      token = '';
      const response = await exec();

      expect(response.status).toBe(401);
      expect(response.text).toMatch(/Access Denied/i);
    });

    it('should return 400 if client sends genre less than 5 chars', async () => {
      name = '1234';

      const response = await exec();

      expect(response.status).toBe(400);
      expect(response.text).toMatch(/length/i);
    });

    it('should return 400 if client sends genre more than 50 chars', async () => {
      name = '1'.repeat(51);
      
      const response = await exec();

      expect(response.status).toBe(400);
      expect(response.text).toMatch(/length/i);
    });

    it('should save genre for a valid genre', async () => {
      
      const response = await exec();
      const genre = await Genre.find({ name: name });

      expect(response.status).toBe(200);
      expect(genre).not.toBeNull();
    });

    it('should return genre for a valid genre', async () => {
      
      const response = await exec();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', name);
    });
  });
});