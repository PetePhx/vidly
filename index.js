const express = require('express');
const app = express();
const { createLogger, format, transports } = require('winston');

require('./startup/logging');
require('./startup/routes.js')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

process.on('unhandledRejection', (exc) => { throw(exc) });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  createLogger({ transports: new transports.Console(), format: format.cli() })
    .info(`Listening on port ${port}...`)
});