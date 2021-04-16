const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

require("./startup/logger")();
require("./startup/init")();
require("./firebase")();
require("./startup/routes")(app);
require("./startup/database")();

const server = app.listen(PORT, () =>
  console.log(`listening to port ${PORT}...`)
);

module.exports = server;
