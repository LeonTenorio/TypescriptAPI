## Base implementationof a Restfull API using Typescript

In that project we have a basic implementation of a restfull api in typescript using an architecture with services, handlers, navigations and controllers.

Using that like a base project you need to know that the services is something like an unit, the handlers does some process on a request and maybe use some services to do it and the controller are used to bind an endpoint to a sequence of handlers (also called navigation).

Here I used MONGODB and Firebase to provide my data services.

So far we don't have any real database implementation, but MONGODB has been used to create a session and if all database changes happen successfully, for each place using a service with database transaction the changes will be committed and if not that changes will be rolled back.

The Firebase has been used to implement the online login service and the offline local login service was implemented using jsonwebtoken package. Now we have that functions:

- `createAuthAccount`: Using the `email` and `password` that service creates an account and if it was a success return the `token` and `userId`;
- `checkLoginToken`: Using the `token`that service check if it's a valid one and if that is true returns the `userId` and `email` of the user it belongs to;
- `signOutAllAcounts`: Using the `token` that service check if it's a valid one and if that is true sign out in all accounts of the user who owns the token;
- `signInWithEmailAndPassword`: Using the `email` and `password` that service try to sign in in an account and if the process was a success return the `token` and `userId`. If is necessary to validate the email to continue with the process that service send an email making possible to the user verify your email;
- `updateEmailAndPassword`: Using the `token`, new `email` and new `password` that service check if that token is a valid one and if it is true change the `email` and `password` of that account to the new values and return the new `token` and the `userId`;
- `deleteAccount`: Using a `token` of the account, check if it's a valid one and if that is true try to delete the user account.
- `requestResetPassword`: Using the `email`of the account that service send an request reset password link to the user.

In that project we have 3 different environments, the production env, the beta env and the local env configured like that:

- LOCAL: The default environment. That env can be used with the `-l` or `--local` paramater in the command line. That mode will use the `.env` file like environtment variables and will use a local implementation to emule the firebase auth. We need to configure the `JWT_SECRET` and `MONGODB_URL`.
- BETA: That env can be used with the `-b` or `--beta` paramater in the command line. That mode will use the `.env.beta` file like environtment variables and will use the configured firebase auth according the `beta.firebaseServiceAccount.json` file. We need to configure the `MONGODB_URL`, `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_DATABASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID` and `FIREBASE_MEASUREMENT_ID`.
- PROD: That env can be used with the `-p` or `--prod` paramater in the command line. That mode will use the `.env.prod` file like environtment variables and will use the configured firebase auth according the `prod.firebaseServiceAccount.json` file. We need to configure the `MONGODB_URL`, `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_DATABASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID` and `FIREBASE_MEASUREMENT_ID`.

The `.env.*` configuration using all possible variables is like that:

```
JWT_SECRET=`Jsonwebtoken secret token to generate the local emulated firebase auth token`
MONGODB_URL='Mongo DB Url'

FIREBASE_API_KEY='Firebase api key'
FIREBASE_AUTH_DOMAIN='Firebase auth domain'
FIREBASE_DATABASE_URL='Firebase database url'
FIREBASE_PROJECT_ID='Firebase project id'
FIREBASE_STORAGE_BUCKET='Firebase storage bucket'
FIREBASE_MESSAGING_SENDER_ID='Firebase messaging sender id'
FIREBASE_APP_ID='Firebase app id'
FIREBASE_MEASUREMENT_ID='Firebase measurement id'
```

The `beta.firebaseServiceAccount.json` or `prod.firebaseServiceAccount.json` is the firebase admin sdk service account and you can download that configuration file in your project accessing the configurations -> service account -> firebase sdk admin -> generate private key for node.js.

To use the local environment you need to use the mongodb docker configured like a compose inside the [localmongo](localmongo/docker-compose.yml) (Thanks for the mongo set configuration in https://github.com/UpSync-Dev/docker-compose-mongo-replica-set). So in the first time you need to start the docker configuration running `docker-compose up -d` inside that folder and in the next times you can start the 3 docker sequence from the first to the last, something like that: `sudo systemctl start docker; sudo docker start fd9b9b6ca73e; sudo docker start 4c90e0b82e06; sudo docker start 0502e60a43ec`
