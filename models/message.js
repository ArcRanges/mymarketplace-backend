const Joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const validate = (data) => {
  const schema = Joi.object({
    text: Joi.string().min(3).max(255).required(),
    conversationId: Joi.string().max(255).required(),
  });
  return schema.validate(data);
};

const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      text: {
        type: String,
        maxlength: 255,
        required: true,
      },
      createdBy: {
        type: ObjectId,
        ref: "User",
      },
      conversationId: {
        type: ObjectId,
        ref: "Conversation",
      },
    },
    { timestamps: true }
  )
);

exports.Message = Message;
exports.validate = validate;
