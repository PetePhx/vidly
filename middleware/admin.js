const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  if (!config.get("requiresAuth")) return next();

  if (!req.user.isAdmin)
    return res.status(403).send("Access denied for non-admin user.");

  next();
};
