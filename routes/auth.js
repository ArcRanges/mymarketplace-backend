const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");
const { authenticate } = require("../firebase/functions");

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(255).required(),
  });

  return schema.validate(data);
};

const auth = async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  // get user data from db using email
  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(400).send("Invalid Username and/or Password");

  // finally check password if it's valid
  const isValidUser = await bcrypt.compare(body.password, user.password);
  if (!isValidUser)
    return res.status(400).send("Invalid email and/or password.");

  const token = user.generateAuthToken();

  authenticate(user.id, (firebaseToken) => {
    res.set("x-auth-token", token).status(200).send({
      success: true,
      message: "Successfully authenticated",
      firebaseToken,
    });
  });
};

router.post("/", auth);

module.exports = router;
