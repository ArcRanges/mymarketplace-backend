Before you run the server, make sure you've downloaded the service account file in your Firebase Account Settings. [More info here](https://firebase.google.com/docs/admin/setup).

Then once you've got that service account file, save it somewhere safe, fill in the blanks below.

```
export FIREBASE_TYPE="service_account";
export FIREBASE_PROJECT_ID="<FILL ME IN>";
export FIREBASE_PRIVATE_KEY_ID="<FILL ME IN>";
export FIREBASE_PRIVATE_KEY="<FILL ME IN>";
export FIREBASE_CLIENT_EMAIL="<FILL ME IN>";
export FIREBASE_CLIENT_ID="<FILL ME IN>";
export FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth";
export FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token";
export FIREBASE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs";
export FIREBASE_CLIENT_X509_CERT_URL="<FILL ME IN>";
export FIREBASE_DATABASE_URL=<FILL ME IN>;
export jwtPrivateKey=; // required for JWT Auth Tokens
```
