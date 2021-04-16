const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");
const { User, validate } = require("../models/user");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { createUser } = require("../firebase/functions");

const getAllUsers = async (req, res) => {
  res.status(200).send([]);
};

const createNewUser = async (req, res) => {
  const { body } = req;

  // validate data coming from client
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if email already exists
  const userExists = await User.find({ email: body.email });
  if (userExists.length) {
    return res.status(400).send("Email is already being used.");
  }

  // proceed on creating a new User
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(body.password, salt);

  body.password = hashedPassword;
  body.isAdmin = false;

  let newUser = await User.create(body);

  const token = newUser.generateAuthToken();

  // create user in Firebase
  body.uid = newUser.id;
  await createUser(body);

  res
    .set("x-auth-token", token)
    .status(200)
    .send(_.pick(newUser, ["_id", "name", "email", "isAdmin"]));
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(400).send([]);
  }

  return res.send(
    _.pick(user, [
      "_id",
      "name",
      "email",
      "isAdmin",
      "profilePhoto",
      "coverPhoto",
    ])
  );
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  let user = await User.findById(id);
  if (!user) {
    return res.status(400).send([]);
  }

  user = await User.findOneAndUpdate({ _id: id }, body, { new: true });

  res.send(
    _.pick(user, [
      "_id",
      "name",
      "email",
      "isAdmin",
      "profilePhoto",
      "coverPhoto",
    ])
  );
};

router.get("/", getAllUsers);
router.post("/", createNewUser);
router.get("/:id", [validateObjectId], getUserById);
router.put("/:id", [auth, validateObjectId], updateUserById);
// router.delete('/:id', deleteUserById);

module.exports = router;
