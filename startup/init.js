const winston = require("winston");
const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    winston.error("FATAL ERROR : can't find jwtPrivateKey");
    process.exit(1);
  }
};
