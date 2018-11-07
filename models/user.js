const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name:     Joi.string().min(3).max(255).required(),
    email:    Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(5).max(20).required(),
  };
  return Joi.validate(user, schema);
}

module.exports.validate = validateUser;
module.exports.User = User;