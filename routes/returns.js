const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const Joi = require("joi");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental)
    return res.status(404).send("No rental with the given properties found.");
  if (rental.dateReturned)
    return res.status(400).send("rental return is already processed.");

  rental.returnIt();
  await rental.save();

  await Movie.updateOne(
    { _id: req.body.movieId },
    {
      $inc: { numberInStock: 1 }
    }
  );

  res.send(rental);
});

function validateReturn(obj) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(obj, schema);
}

module.exports = router;
