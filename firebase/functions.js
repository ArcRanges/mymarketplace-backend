const admin = require("firebase-admin");
const winston = require("winston");

const createUser = async (data) => {
  admin
    .auth()
    .createUser(data)
    .then((userRecord) => {
      winston.info("Successfully created new user: ", userRecord.uid);
    })
    .catch((error) => {
      winston.error("Error creating new user:", error);
    });
};

const authenticate = async (uid, callback) => {
  admin
    .auth()
    .createCustomToken(uid)
    .then((customToken) => {
      callback(customToken);
    })
    .catch((error) => {
      winston.error("Error creating custom token:");
      winston.error(error);
    });
};

const sendMessage = async (conversationId, listingId, message) => {
  const ref = `${listingId}/${conversationId}/`;

  return admin
    .database()
    .ref(ref)
    .push(message)
    .then((v) => console.log("success!"))
    .catch((err) => console.log(err));
};

module.exports = {
  createUser,
  authenticate,
  sendMessage,
};
