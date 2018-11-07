const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { User, validate } = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.send(users);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('The email is already registered.');

  user = new User({
    name:     req.body.name,
    email:    req.body.email,
    password: req.body.password,
  });

  await user.save();
  return res.send(user);
});

module.exports = router;