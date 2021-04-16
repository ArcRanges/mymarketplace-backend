const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const titlecase = require("../utility/titlecase");

const { Category, validate } = require("../models/category");

const getAllCategories = async (req, res) => {
  const result = await Category.find().sort("value");
  res.send(result);
};

const createNewCategory = async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const categoryExists = await Category.find({ value: body.value });
  if (categoryExists.length)
    return res.status(400).send(`Category ${body.value} already exists.`);

  const result = await Category.create(body);
  res.send(result);
};

router.get("/", getAllCategories);
router.post("/", [auth, isAdmin], createNewCategory);
// router.put('/:id', editCategoryById);

module.exports = router;
