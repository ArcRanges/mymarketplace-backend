const fetch = require("node-fetch");
const { Expo } = require("expo-server-sdk");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

const auth = require("../middleware/auth");
const userExists = require("../middleware/userExists");
const { User } = require("../models/user");

// const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
const expo = new Expo();

const validateToken = (token) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  return schema.validate(token);
};

const validateMessage = (message) => {
  const schema = Joi.object({
    sound: Joi.string().max(255).default("default"),
    title: Joi.string().max(30).required(),
    body: Joi.string().max(255).required(),
    data: Joi.object().optional(),
  });
  return schema.validate(message);
};

const registerNotifications = async (req, res) => {
  const { body } = req;
  const { error } = validateToken(body);
  if (error) return res.status(400).send(error.details[0].message);

  await User.findByIdAndUpdate(
    req.user._id,
    {
      expoToken: body.token,
    },
    { new: true }
  );

  res.sendStatus(200);
};

const sendNotification = async (chunk) => {
  try {
    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    console.log(ticketChunk);
    tickets.push(...ticketChunk);
    // NOTE: If a ticket contains an error code in ticket.details.error, you
    // must handle it appropriately. The error codes are listed in the Expo
    // documentation:
    // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
  } catch (error) {
    console.error(error);
  }
};

// sample message format
// {
//   to: pushToken,
//   sound: 'default',
//   title: 'Title',
//   body: 'This is a test notification',
//   data: { withSome: 'data' },
// }
const sendNotifications = async (tokens, message) => {
  let messages = [];

  for (let pushToken of tokens) {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push(message);
  }

  // chunk messages in 1000's per batch
  let chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
    await sendNotification(chunk);
  }
};

const notifyUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Id is required");

  const { message } = req.body;
  if (!message) return res.status(400).send("Message is required");

  // validate message first
  const { error } = validateMessage(message);
  if (error) return res.status(400).send(error.details[0].message);

  // find user by id
  const user = await User.findById(id);
  if (!user) return res.status(400).send("User does not exist");

  const token = user.expoToken;
  if (!token) return res.sendStatus(200);

  // send to Expo only if User has Token Permissions
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      ...message,
    }),
  })
    .then((result) => result.json())
    .then((result) => {
      res.sendStatus(200);
      // console.log(result);
    })
    .catch((error) => {
      console.log("Something went wrong when sending push notification");
      console.log(error);

      res.status(500).send("Internal Server Error");
    });
};

router.post("/notifyUser/:id", notifyUser);

router.post(
  "/registerNotifications",
  [auth, userExists],
  registerNotifications
);

module.exports = router;
