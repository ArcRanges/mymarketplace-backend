const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const userExists = require("../middleware/userExists");
const validateObjectId = require("../middleware/validateObjectId");

const { ObjectId } = require("mongoose").Types;

const { Listing, validate } = require("../models/listing");

const searchListingsByUserId = async (req, res) => {
  const { id } = req.params;

  const listings = await Listing.find({
    $and: [{ postedBy: ObjectId(id) }, { status: { $ne: "removed" } }],
  });

  res.send(listings);
};

const searchListingsByCategoryId = async (req, res) => {
  const { id } = req.params;
  const listings = await Listing.find({
    $and: [{ category: ObjectId(id) }, { status: { $ne: "removed" } }],
  });

  res.send(listings);
};

router.get("/listingByUserId/:id?", [validateObjectId], searchListingsByUserId);

router.get(
  "/listingByCategoryId/:id?",
  [validateObjectId],
  searchListingsByCategoryId
);
module.exports = router;
