const router = require("express").Router();
const { response } = require("express");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const isAdmin = require("../middleware/isAdmin");
const { User } = require("../models/user");
const Conversation = mongoose.model("Conversation");

// get conversations by User ID
// const getConversationsByLoggedInUser = async (req, res) => {
//   const { user } = req;

//   const loggedInUser = await User.findById(user._id);

//   console.log(loggedInUser);
//   const result = await loggedInUser.deepPopulate(
//     "conversations conversations.conversation"
//   );
//   res.send(result);
// };

// get conversation by Conversation ID
// set conversation status to 'archived' or 'removed
const updateConversationStatus = async (id, status) => {
  const conversation = await Conversation.findByIdAndUpdate(
    id,
    {
      status,
    },
    { new: true }
  );

  return conversation;
};

// remove conversation by Conversation ID
// remove all conversations by UserId : require Firebase

const updateConversationById = async (req, res) => {
  const { id } = req.params;

  // update conversation status
  const result = await updateConversationStatus(id, "archived");

  res.send(result);
};

// const removeConversationById = async (req, res) => {
//   const { id } = req.params;

//   // only Admin or User can remove this conversation
//   const result = await updateConversationStatus(id, "removed");
//   res.send(result);
// };

const removeConversationOfUserById = async (req, res) => {
  // get id of conversation
  const { id } = req.params;

  console.log(id);
  // find user
  const result = await User.findOneAndUpdate(
    { _id: ObjectId(req.user._id), "conversations.conversation": ObjectId(id) },
    { $set: { "conversations.$.status": "archived" } },
    { new: true }
  );

  res.send({ success: true });
};

router.put("/:id", [validateObjectId, auth, isAdmin], updateConversationById);
// router.delete(
//   "/:id",
//   [validateObjectId, auth, isAdmin],
//   removeConversationById
// );

router.delete("/:id", [auth], removeConversationOfUserById);
module.exports = router;
