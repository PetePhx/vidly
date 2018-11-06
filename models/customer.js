const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean(),
    name:   Joi.string().min(5).max(100).required(),
    phone:  Joi.string().min(5).max(100).required(),
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
exports.customerSchema = customerSchema;