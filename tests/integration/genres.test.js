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
    
    it('should return 404 if genre with a given id does not exit', async () => {
      const id = new Genre()._id;
      const response = await request(server).get(`/api/genres/${id}`);
      expect(response.status).toBe(404);
      expect(response.text).toMatch(/not found/i);
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

  describe('PUT /:id', () => {
    let token; 
    let newName; 
    let genre; 
    let id; 

    const exec = async () => {
      return await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      // create a genre and save in the db      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      token = new User({ isAdmin: true }).generateAuthToken();     
      id = genre._id; 
      newName = 'updatedName'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      newName = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      newName = 'a'.repeat(51);

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is invalid', async () => {
      id = '1';

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if genre with the given id was not found', async () => {
      id = (new Genre())._id;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should update the genre if input is valid', async () => {
      await exec();

      const updatedGenre = await Genre.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    it('should return the updated genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });

  describe('DELETE /:id', () => {
    let token; 
    let genre; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      id = genre._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id was found', async () => {
      id = new Genre()._id;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the genre if input is valid', async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it('should return the removed genre', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', genre.name);
    });
  });
});