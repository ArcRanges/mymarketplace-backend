const Joi = require("joi");
const mongoose = require("mongoose");

const validate = (data) => {
  const schema = Joi.object({
    value: Joi.string().min(3).max(255).required(),
  });
  return schema.validate(data);
};

const Category = mongoose.model(
  "Category",
  new mongoose.Schema(
    {
      value: {
        type: String,
        maxlength: 255,
        required: true,
        unique: true,
      },
    },
    { timestamps: true }
  )
);

exports.Category = Category;
exports.validate = validate;
