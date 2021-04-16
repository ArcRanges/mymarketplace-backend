const mongoose = require("mongoose");
const Joi = require("joi");
const { ObjectId } = mongoose.Schema.Types;

const RATES = [
  "Fair Pricing",
  "Item as Described",
  "Punctuality",
  "Response Time",
];

const validate = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    stars: Joi.number().min(1).max(5).required(),
    rate: Joi.number(),
    message: Joi.string().max(255).trim(),
  });

  return schema.validate(data);
};

const ratingSchema = new mongoose.Schema({
  ratedTo: {
    type: ObjectId,
    ref: "User",
  },
  ratedBy: {
    type: ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  rate: {
    type: String,
    enum: RATES,
  },
  message: {
    type: String,
    maxlength: 255,
  },
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports.Rating = Rating;
module.exports.validate = validate;
