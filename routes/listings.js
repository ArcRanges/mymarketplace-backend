const express = require("express");
const router = express.Router();

const titlecase = require("../utility/titlecase");

const auth = require("../middleware/auth");
const userExists = require("../middleware/userExists");
const validateObjectId = require("../middleware/validateObjectId");

const { Listing, validate } = require("../models/listing");
const constants = require("../constants");

const getAllListings = async (req, res) => {
  // model.findOne({name: new RegExp('^'+name+'$', "i")},
  const { params } = req;
  const { query, sort, page } = params;

  let listings = await Listing.find({ status: { $ne: "removed" } }).sort(
    `${req.params.sort} -createdAt`
  );

  // first filter by query
  if (query) {
    listings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
      $and: [{ status: { $ne: "removed" } }],
    });
  }

  // then filter by page
  // that is, check if listings length > 10
  // else, just send the filtered listings

  if (listings.length > constants.Pagination.maxlength) {
    let options = {
      limit: 10,
      page: page,
    };
    listings
      .aggregatePaginate({ name: query }, options)
      .then((listings) => {
        return res.send(listings);
      })
      .catch(function (err) {
        return res.status(500).send("Internal Server Error");
      });
  }
  res.send(listings);
};

const createNewListing = async (req, res) => {
  const { user, body } = req;
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  // titleCase the listing title
  body.title = titlecase(body.title);

  // create new listing
  const listing = {
    ...body,
    postedBy: user._id,
  };

  const result = await Listing.create(listing);

  res.send(result);
};

const updateListingById = async (req, res) => {
  const { body, user } = req;
  const { id } = req.params;

  // find listing if it exists
  let listing = await Listing.findById(id);
  if (!listing) return res.status(400).send("Listing not found");

  // trying to edit someone's listing
  if (!listing.postedBy.equals(user._id))
    return res.status(400).send("Request not permitted.");

  // only update after validations
  if (body.title) {
    body.title = titlecase(body.title);
  }

  listing = await Listing.findOneAndUpdate({ _id: id }, body, { new: true });

  res.send(listing);
};

const deleteListingById = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findByIdAndUpdate(
    { _id: id },
    { status: "removed" },
    { new: true }
  );
  if (!listing) return res.status(400).send("Listing not found");

  console.log(listing);

  res.send("Successfully deleted");
};

router.get("/:query?/:sort?/:page?", getAllListings);
router.post("/", [auth, userExists], createNewListing);
router.put("/:id", [auth, validateObjectId, userExists], updateListingById);
router.delete("/:id", [auth, validateObjectId, userExists], deleteListingById);

module.exports = router;
