const mongoose = require("mongoose");
const { createLogger, format, transports } = require("winston");
const dbLogger = createLogger({
  transports: new transports.File({ filename: "combined.log" })
});
const config = require("config");

if (process.env.NODE_ENV !== "production") {
  dbLogger.add(new transports.Console({ format: format.cli() }));
}

module.exports = function() {
  const db = config.get("db");
  mongoose
    .connect(
      db,
      { useNewUrlParser: true, useCreateIndex: true }
    )
    .then(() => dbLogger.info(`Connected to ${db}...`));
};
