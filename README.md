## Base implementationof a Restfull API using Typescript

In that project we have a basic implementation of a restfull api in typescript using an architecture with services, handlers, navigations and controllers.

Using that as a base you need to know that, the services is something like an unit, the handlers process some process on an request and maybe use some services to do it and the controller are used to bind an endpoint to a sequence of handlers (also called navigation).

Here I used MONGODB and Firebase to provide my data services.

So far we don't have any real database implementation, but MONGODB has been used to create a session and for each request if the response has a code above 400 the session rollback will be called, otherwise the database changes will be confirmed. And if something goes wrong with the endpoint process the rollback will be called to because the response will be 500.

The Firebase has been used to implement the login service and for now we only have a service to signIn (`signInWithEmailAndPassword`), a service to signUp (`createAuthAccount`) and a service to check the login token (`checkLoginToken`).

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

And the Firebase admin configuration file is the `firebaseServiceAccount.json` file, that file you can download in the firebase console.
