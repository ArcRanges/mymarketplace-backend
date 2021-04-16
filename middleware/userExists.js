const { User } = require("../models/user");

module.exports = async function (req, res, next) {
  const { _id } = req.user;

  // validate if user exists
  const user = await User.findById(_id);
  if (!user) return res.status(400).send("User does not exist");

  // proceed because user exists
  next();
};
