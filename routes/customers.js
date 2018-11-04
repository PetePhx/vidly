const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');

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

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('Customer ID not found.');
  res.send(customer);
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send('Error: ' + error.details[0].message);
  
  let customer = new Customer({
    isGold: req.body.isGold,
    name:   req.body.name,
    phone:  req.body.phone,
  });
  
  customer = await customer.save();
  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send('Error: ' + error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    {
      isGold: !!req.body.isGold,
      name:   req.body.name,
      phone:  req.body.phone,
    },
    { new: true });

  if (!customer) return res.status(404).send('Customer Not Found.');
  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer) return res.status(404).send('Customer Not Found.');
  res.send(customer);
});

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean(),
    name:   Joi.string().min(5).max(100).required(),
    phone:  Joi.string().min(5).max(100).required(),
  };

  return Joi.validate(customer, schema);
}

module.exports = router;