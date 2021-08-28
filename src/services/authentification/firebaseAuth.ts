import firebase from "firebase";
import * as admin from "firebase-admin";
import { DatabaseResult } from "../../structure/databaseResult";

const serviceAccount = require("../../../firebaseServiceAccount.json");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseAdminConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

let db: admin.database.Database | undefined = undefined;
let auth: firebase.auth.Auth | undefined = undefined;
let adminAuth: admin.auth.Auth | undefined = undefined;

const getFirebaseReference = (): {
  db: admin.database.Database;
  auth: firebase.auth.Auth;
  adminAuth: admin.auth.Auth;
} => {
  if (db === undefined || auth === undefined || adminAuth === undefined) {
    firebase.initializeApp(firebaseConfig);
    admin.initializeApp(firebaseAdminConfig);

    db = admin.database();
    auth = firebase.auth();
    adminAuth = admin.auth();
  }
  return { db: db, auth: auth, adminAuth: adminAuth };
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<DatabaseResult<{ token: string; userId: string }>> => {
  const { auth, adminAuth } = getFirebaseReference();
  try {
    const authResponse = await auth.signInWithEmailAndPassword(email, password);
    if (authResponse.user === null) throw Error("Null firebase user id");
    const customToken = await adminAuth.createCustomToken(email);
    return {
      success: true,
      data: {
        token: customToken,
        userId: authResponse.user.uid,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

export const createAuthAccount = async (
  email: string,
  password: string
): Promise<DatabaseResult<{ token: string; userId: string }>> => {
  const { auth, adminAuth } = getFirebaseReference();
  try {
    const authResponse = await auth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (authResponse.user === null) throw Error("Null firebase user id");
    const customToken = await adminAuth.createCustomToken(email);
    return {
      success: true,
      data: {
        token: customToken,
        userId: authResponse.user.uid,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

export const checkLoginToken = async (
  token: string
): Promise<DatabaseResult<{ userId: string }>> => {
  const { auth } = getFirebaseReference();
  try {
    const authResponse = await auth.signInWithCustomToken(token);

    if (authResponse.user === null) throw Error("Null firebase user id");
    return {
      success: true,
      data: {
        userId: authResponse.user.uid,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};
