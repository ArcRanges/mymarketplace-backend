# mymarketplace-backend
This is the backend for my [Marketplace App](https://github.com/ArcRanges/my-marketplace) built with NodeJS, ExpressJS, MongoDB, Expo SDK, and Firebase Admin SDK.

## Routes
```
/api/
----/auth
----/categories
----/conversations
----/expo
----/listings
----/messages
----/my
----/ratings
----/search/
----/users
```

## Dependencies
```
"bcrypt": "^5.0.1",
"config": "^3.3.6",
"expo-server-sdk": "^3.6.0",
"express": "^4.17.1",
"firebase-admin": "^9.6.0",
"joi": "^17.4.0",
"jsonwebtoken": "^8.5.1",
"lodash": "^4.17.21",
"mongodb": "^3.6.5",
"mongoose": "^5.12.2",
"mongoose-aggregate-paginate-v2": "^1.0.42",
"mongoose-deep-populate": "^3.2.0",
"node-fetch": "^2.6.1",
"winston": "^3.3.3"
```

## Instructions
Before you proceed, make sure you initialize all the proper environment variables.
[Here's the link to the initialization part](https://github.com/ArcRanges/mymarketplace-backend/blob/main/initialize.md).
```
git clone <this repo>
cd <this repo>
npm install
nodemon or node
// should listen to port 3000 by default
```
