import firebase from 'firebase';
import * as admin from 'firebase-admin';
import { DatabaseResult } from '../../structure/databaseResult';

const serviceAccount = require('../../../firebaseServiceAccount.json');

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

    if (authResponse.user === null) throw Error('Null firebase user id');
    return {
      success: true,
      data: {
        token: await authResponse.user.getIdToken(),
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
): Promise<
  DatabaseResult<{
    userId: string;
    email: string;
  }>
> => {
  const { auth, adminAuth } = getFirebaseReference();
  try {
    const verifyTokenResult = await adminAuth.verifyIdToken(token, true);
    if (verifyTokenResult.email === undefined) throw Error('Undefined email');
    const authUser = await adminAuth.getUserByEmail(verifyTokenResult.email);
    return {
      success: true,
      data: {
        userId: authUser.uid,
        email: verifyTokenResult.email,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

export const signOutAllAcounts = async (
  token: string
): Promise<DatabaseResult<null>> => {
  const userResult = await checkLoginToken(token);
  if (!userResult.success) {
    return userResult;
  }
  const { auth, adminAuth } = getFirebaseReference();
  try {
    await adminAuth.revokeRefreshTokens(userResult.data.userId);
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }

  return {
    success: true,
    data: null,
  };
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<DatabaseResult<{ token: string; userId: string }>> => {
  const { auth, adminAuth } = getFirebaseReference();
  try {
    const authResponse = await auth.signInWithEmailAndPassword(email, password);
    if (authResponse.user === null) throw Error('Null firebase user id');
    return {
      success: true,
      data: {
        token: await authResponse.user.getIdToken(),
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

export const updateEmailAndPassword = async (
  token: string,
  email: string,
  password: string
): Promise<DatabaseResult<null>> => {
  const userResult = await checkLoginToken(token);
  if (!userResult.success) {
    return userResult;
  }
  try {
    // const user = userResult.data.user;
    // if (user.email !== email) {
    //   await user.updateEmail(email);
    // }
    // await user.updatePassword(password);
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }

  return {
    success: true,
    data: null,
  };
};

export const deleteAccount = async (
  token: string
): Promise<DatabaseResult<null>> => {
  // const signOutResult = await signOutAllAcounts(token);
  // if (!signOutResult.success) return signOutResult;

  const userResult = await checkLoginToken(token);

  if (!userResult.success) {
    return userResult;
  }
  const { adminAuth } = getFirebaseReference();
  const { userId } = userResult.data;
  try {
    // Here we have something very peculiar in firebase auth
    // For user that was created using email, we need to remove the userId account and the email acount
    // of the firebase auth
    await adminAuth.deleteUser(userId);
    // await adminAuth.deleteUser(email);
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }

  return {
    success: true,
    data: null,
  };
};
