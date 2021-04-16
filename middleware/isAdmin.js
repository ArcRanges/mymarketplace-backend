// checks authentication token for authorization levels
const jwt = require("jsonwebtoken");
const config = require("config");
const winston = require("winston");

module.exports = function (req, res, next) {
  // assumes that it's been passed to Auth middleware already
  const token = req.header("x-auth-token");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    if (!decoded.isAdmin) return res.status(401).send("Unauthorized access");

    // isAdministrator, allow to proceed
    next();
  } catch (error) {
    winston.error("Something went wrong while decoding x-auth-token");
    winston.error(error);
    res.status(400).send("Invalid token");
  }
};
