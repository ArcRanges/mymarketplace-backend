const { ObjectId } = require("mongoose").Types;

module.exports = function (req, res, next) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) return res.status(400).send("Invalid ID " + id);

  next();
};
