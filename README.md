## Base implementationof a Restfull API using Typescript

In that project we have a basic implementation of a restfull api in typescript using an architecture with services, handlers, navigations and controllers.

Using that as a base you need to know that, the services is something like an unit, the handlers process some process on an request and maybe use some services to do it and the controller are used to bind an endpoint to a sequence of handlers (also called navigation).

Here I used MONGODB and Firebase to provide my data services.

So far we don't have any real database implementation, but MONGODB has been used to create a session and for each request if the response has a code above 400 the session rollback will be called, otherwise the database changes will be confirmed. And if something goes wrong with the endpoint process the rollback will be called to because the response will be 500.

The Firebase has been used to implement the login service and we have that functions:

- `createAuthAccount`: Using the `email` and `password` that service creates an account and if it was a success return the `token` and `userId`;
- `checkLoginToken`: Using the `token`that service check if it's a valid one and if that is true returns the `userId` and `email` of the user it belongs to;
- `signOutAllAcounts`: Using the `token` that service check if it's a valid one and if that is true sign out in all accounts of the user who owns the token;
- `signInWithEmailAndPassword`: Using the `email` and `password` that service try to sign in in an account and if the process was a success return the `token` and `userId`;
- `updateEmailAndPassword`: Using the `token`, new `email` and new `password` that service check if that token is a valid one and if it is true change the `email` and `password` of that account to the new values and return the new `token` and the `userId`;
- `deleteAccount`: Using a `token` of the account, check if it's a valid one and if that is true try to delete the user account.

The MONGODB configuration and a piece of Firebase configuration is inside the `.env` file in that schema:

```
MONGODB_USER='Mongo db user'
MONGODB_PASSWORD='Mongo db password'
MONGODB_DATABASE='Mongo db database'

FIREBASE_API_KEY='Firebase api key'
FIREBASE_AUTH_DOMAIN='Firebase auth domain'
FIREBASE_DATABASE_URL='Firebase database url'
FIREBASE_PROJECT_ID='Firebase project id'
FIREBASE_STORAGE_BUCKET='Firebase storage bucket'
FIREBASE_MESSAGING_SENDER_ID='Firebase messaging sender id'
FIREBASE_APP_ID='Firebase app id'
FIREBASE_MEASUREMENT_ID='Firebase measurement id'
```

And the Firebase admin configuration file is the `firebaseServiceAccount.json` file, that file you can download in the firebase console and put here with that filename.
