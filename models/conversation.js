const Joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const deepPopulate = require("mongoose-deep-populate")(mongoose);

const conversationSchema = new mongoose.Schema(
  {
    messages: [
      {
        type: ObjectId,
        ref: "Message",
      },
    ],
    listing: {
      type: ObjectId,
      ref: "Listing",
    },
    createdBy: {
      type: ObjectId,
      ref: "User",
    },
    createdTo: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

conversationSchema.plugin(deepPopulate);

const Conversation = mongoose.model("Conversation", conversationSchema);
exports.Conversation = Conversation;
// exports.validate = validate;
