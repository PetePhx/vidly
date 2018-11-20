const express = require('express');
const app = express();
const { createLogger, format, transports } = require('winston');

require('./startup/logging');
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/routes.js')(app);
require('./startup/prod')(app);

process.on('unhandledRejection', (exc) => { throw(exc) });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  createLogger({ transports: new transports.Console(), format: format.cli() })
    .info(`Listening on port ${port}...`)
});

module.exports = server;