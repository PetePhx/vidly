const express = require('express');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

require('./startup/logging');
require('./startup/routes.js')(app);
require('./startup/db')();
require('./startup/config')();

process.on('unhandledRejection', (exc) => { throw(exc) });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));