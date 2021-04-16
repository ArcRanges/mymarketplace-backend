const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userExists = require("../middleware/userExists");

const { Listing } = require("../models/listing");
// const { Conversation } = require("../models/conversation");
const { User } = require("../models/user");

const getMyListings = async (req, res) => {
  const { user } = req;

  const listings = await Listing.find({
    postedBy: user._id,
    status: { $ne: "removed" },
  })
    .populate("category")
    .sort(`${req.params.sort}`);

  res.send(listings);
};

const getMyConversations = async (req, res) => {
  const { user } = req;

  // const conversations = await User.find({
  //   createdBy: user._id,
  // });

  const my = await User.findOne({
    _id: user._id,
    "conversations.status": { $ne: "archived" },
  }).select("conversations");

  if (!my) return res.send([]);

  const result = await my.deepPopulate(
    "conversations conversations.conversation.messages conversations.conversation.messages.createdBy conversations.conversation.listing conversations.conversation.listing.category conversations.conversation.createdBy conversations.conversation.createdTo"
  );
  res.send(result);
};

router.get("/listings", [auth, userExists], getMyListings);
router.get("/conversations", [auth, userExists], getMyConversations);
// router.post("/listings", [auth, userExists], createNewListing);

module.exports = router;
