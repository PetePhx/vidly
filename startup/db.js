const mongoose = require('mongoose');
const { createLogger, format, transports } = require('winston');
const dbLogger = createLogger({ transports: new transports.File({ filename: 'combined.log' }) });

if (process.env.NODE_ENV !== 'production') {
  dbLogger.add(new transports.Console({ format: format.cli() }));
}

module.exports = function () {
  mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useCreateIndex: true, })
  .then(() => dbLogger.info('Connected to the vidly DB.'));
}