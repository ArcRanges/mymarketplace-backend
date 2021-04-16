const _ = require("lodash");
const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const userExists = require("../middleware/userExists");
const { Rating, validate } = require("../models/rating");
const decode = require("../utility/decode");

const getRatingsByUserId = async (req, res) => {
  const { id } = req.params;

  // user exists so get Ratings from db based on user.id
  const ratings = await Rating.find({ ratedTo: id });

  // wil send empty array if no ratings found
  // send Ratings data
  let totalStars = 0;

  _.forEach(ratings, (rate) => {
    totalStars += rate.stars;
  });

  let average = totalStars / ratings.length;
  const result = {
    count: ratings.length,
    totalStars: totalStars,
    average: isNaN(average) ? 0 : average,
    data: ratings,
  };

  res.send(result);
};

const createRatingForUserId = async (req, res) => {
  const token = req.header("x-auth-token");
  const user = decode(token);
  console.log(user);
  const { id } = req.params;

  // check if logged in user is rating themselves
  if (user._id === id)
    return res.status(400).send("Invalid Request: Cannot rate self.");

  const { body } = req;

  // check for data validity
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  let rating = await Rating.create({
    ...body,
    ratedTo: id,
    ratedBy: user._id,
  });

  res.send(rating);
};

router.get("/:id", [validateObjectId], getRatingsByUserId);
router.post(
  "/:id",
  [validateObjectId, auth, userExists],
  createRatingForUserId
);
// update rating by Id
// should only update ratings if they're admin OR the ones who created it

// delete rating by Id
// admin only or by creator

module.exports = router;
