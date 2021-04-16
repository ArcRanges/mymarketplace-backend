const express = require("express");
const auth = require("../routes/auth");
const my = require("../routes/my");
const users = require("../routes/users");
const ratings = require("../routes/ratings");
const listings = require("../routes/listings");
const categories = require("../routes/categories");
const search = require("../routes/search");
const messages = require("../routes/messages");
const conversations = require("../routes/conversations");
const expo = require("../routes/expo");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/auth", auth);
  app.use("/api/my", my);
  app.use("/api/users", users);
  app.use("/api/ratings", ratings);
  app.use("/api/listings", listings);
  app.use("/api/categories", categories);
  app.use("/api/search", search);
  app.use("/api/messages", messages);
  app.use("/api/conversations", conversations);
  app.use("/api/expo", expo);
};
