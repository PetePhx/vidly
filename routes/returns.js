const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  if(!req.body.customerId)
    res.status(400).send('Bad Request: customerId missing');

  if(!req.body.movieId)
    res.status(400).send('Bad Request: movieId missing');

  // res.status(401).send('Unauthorized');
});

module.exports = router;