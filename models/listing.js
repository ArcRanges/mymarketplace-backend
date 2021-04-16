const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Joi = require("joi");
const constants = require("../constants");
const { ObjectId } = mongoose.Types;

const STATUS = ["pending", "listed", "removed", "rejected"];

const validate = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(constants.String.maxlength)
      .required()
      .trim(),
    description: Joi.string().optional().max(constants.String.maxlength).trim(),
    category: Joi.string().required().max(constants.String.maxlength),
    images: Joi.array().items(Joi.string().uri()).max(7).required(),
    location: Joi.object({ latitude: Joi.number(), longitude: Joi.number() }),
    price: Joi.number().min(1).max(1000000).required(),
  });

  return schema.validate(data);
};

const listingSchema = new mongoose.Schema(
  {
    postedBy: {
      type: ObjectId,
      ref: "User",
      index: true,
    },
    title: {
      type: String,
      minlength: 5,
      maxlength: constants.String.maxlength,
      required: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: constants.String.maxlength,
      index: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: STATUS,
      default: STATUS[0],
    },
    location: {
      type: Object,
      required: false,
    },
    price: {
      type: Number,
      min: 0,
      max: 1000000,
      index: true,
    },
  },
  { timestamps: true }
);

listingSchema.plugin(aggregatePaginate);

const Listing = mongoose.model("Listing", listingSchema);

Listing.aggregatePaginate.options = {
  limit: 10,
};

module.exports.Listing = Listing;
module.exports.validate = validate;
