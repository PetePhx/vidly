const request = require('supertest');
const { Genre } = require('../../models/genre');
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
      // expect(response.body).toMatch(/not found/i);
    });
  })
});