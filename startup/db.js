const mongoose = require('mongoose');
const { createLogger, transports } = require('winston');
const dbLogger = createLogger({ transports: new transports.File({ filename: 'combined.log' }) });

module.exports = function () {
  mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useCreateIndex: true, })
  .then(() => dbLogger.info('Connected to the vidly DB.'));
}