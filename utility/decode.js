const jwt = require("jsonwebtoken");
const config = require("config");
const winston = require("winston");

module.exports = function (token) {
  try {
    return jwt.verify(token, config.get("jwtPrivateKey"));
  } catch (error) {
    winston.error("Something went wrong while decoding token using utility");
    winston.error(error);
    res.status(400).send("Invalid token");
  }
};
