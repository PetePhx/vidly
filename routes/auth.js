const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.send(users);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('invalid email or passwrod');

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('invalid email or passwrod');

  const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  return res.send(token);
});

function validate(data) {
  const schema = {
    email:    Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(5).max(20).required(),
  };
  return Joi.validate(data, schema);
}

module.exports = router;