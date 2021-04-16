const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const firebase = require("../firebase/functions");
const { ObjectId } = mongoose.Types;
const { Message, validate } = require("../models/message");
const { User } = require("../models/user");
// const { Conversation } = mongoose.model("Conversation");

const { Conversation } = require("../models/conversation");
const { Listing } = require("../models/listing");

const router = require("express").Router();

const parseMessage = (messageObj, userObj) => {
  const result = {
    ..._.pick(messageObj, ["_id", "text", "createdAt"]),
    user: _.pick(userObj, ["_id", "name"]),
  };
  result.createdAt = new Date(result.createdAt).toUTCString();
  result._id = ObjectId(result._id).toString();
  result.user._id = ObjectId(result.user._id).toString();
  return result;
};

// deprecated: User my/getMyConversations
const getAllMessagesByCurrentUser = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id);

  let result = await user.deepPopulate(
    "conversations conversations.conversation.messages conversations.conversation.messages.createdBy conversations.conversation.listing conversations.conversation.listing.category conversations.conversation.createdBy"
  );

  res.send(_.pick(result, ["conversations", "_id", "name"]));
};

const updateUserConversation = async (id, conversation) => {
  await User.findByIdAndUpdate(id, {
    $addToSet: {
      conversations: {
        conversation,
      },
    },
  });
};

const createNewMessageForListingId = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const { error } = validate(body);

  if (error) return res.status(400).send(error.details[0].message);

  const listing = await Listing.findById(id); // listing
  const createdBy = await User.findById(req.user._id); // creator
  const createdTo = await User.findById(listing.postedBy); // creator

  const result = await Message.create({
    text: body.text,
    createdBy,
  });

  // find conversationId
  let conversation = await Conversation.find({
    createdBy: body.conversationId,
  });

  if (!conversation.length) {
    // add first message
    conversation = await Conversation.create({
      messages: [result],
      listing,
      createdBy,
      createdTo,
    });

    // update conversations
    updateUserConversation(req.user._id, conversation); // of sender
    updateUserConversation(listing.postedBy, conversation); // of receiver
  } else {
    // append to current conversation
    await Conversation.findOneAndUpdate(
      { createdBy: body.conversationId },
      {
        $push: {
          messages: result,
        },
      },
      { new: true }
    );
  }

  // send message to firebase database
  const message = parseMessage(result, req.user);
  await firebase.sendMessage(body.conversationId, id, message);

  res.sendStatus(200);
};

// router.get("/", [auth], getAllMessagesByCurrentUser);
router.post("/:id", [auth, validateObjectId], createNewMessageForListingId);
module.exports = router;
