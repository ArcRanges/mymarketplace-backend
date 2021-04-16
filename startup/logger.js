const winston = require("winston");

module.exports = function () {
  winston.add(
    new winston.transports.File({ filename: "server.log", level: "info" })
  );
  winston.add(
    new winston.transports.File({ filename: "errors.log", level: "error" })
  );

  winston.add(
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
};
