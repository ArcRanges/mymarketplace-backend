// checks authentication token for validity
const jwt = require("jsonwebtoken");
const config = require("config");
const winston = require("winston");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send("Unauthorized access");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (error) {
    winston.error("Something went wrong while decoding x-auth-token");
    winston.error(error);
    res.status(400).send("Invalid token");
  }
};
