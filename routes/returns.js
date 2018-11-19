const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');

router.post('/', auth, async (req, res) => {
  if(!req.body.customerId) return res.status(400).send('Bad Request: customerId missing');
  if(!req.body.movieId) return res.status(400).send('Bad Request: movieId missing');

  const rental = await Rental.findOne({ 
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId,
  });

  if (!rental) return res.status(404).send('No rental with the given properties found.');
  if (rental.dateReturned) return res.status(400).send('rental return is already processed.');

  rental.dateReturned = Date.now();
  await rental.save();
  res.status(200).send('rental return successful.');
});

module.exports = router;