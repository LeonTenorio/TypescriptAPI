import initEnv from '../../initEnv';

import {
  checkLoginToken,
  createAuthAccount,
  deleteAccount,
  signInWithEmailAndPassword,
  signOutAllAcounts,
  updateEmailAndPassword,
} from './firebaseAuth';

initEnv();

jest.setTimeout(100000);

test('create an account + check login token + delete account', async () => {
  const email = 'test@test.com';
  const password = 'testtest';

  const createAccountResult = await createAuthAccount(email, password);
  expect(createAccountResult.success).toBe(true);

  if (!createAccountResult.success) throw createAccountResult.error;

  const checkLoginTokenResult = await checkLoginToken(
    createAccountResult.data.token
  );
  expect(
    checkLoginTokenResult.success && checkLoginTokenResult.data.email === email
  ).toBe(true);

  const deleteAccountResult = await deleteAccount(
    createAccountResult.data.token
  );
  expect(deleteAccountResult.success).toBe(true);
});

test('create an account + revoke token + check token + signIn + delete account', async () => {
  const email = 'test@test.com';
  const password = 'testtest';

  const createAccountResult = await createAuthAccount(email, password);
  expect(createAccountResult.success).toBe(true);

  if (!createAccountResult.success) throw createAccountResult.error;

  const revokeTokenResult = await signOutAllAcounts(
    createAccountResult.data.token
  );
  expect(revokeTokenResult.success).toBe(true);

  const checkLoginTokenResult = await checkLoginToken(
    createAccountResult.data.token
  );
  expect(checkLoginTokenResult.success).toBe(false);

  const signInResult = await signInWithEmailAndPassword(email, password);
  expect(
    signInResult.success &&
      signInResult.data.userId === createAccountResult.data.userId &&
      signInResult.data.token !== createAccountResult.data.token
  ).toBe(true);
  if (!signInResult.success) throw signInResult.error;

  const deleteAccountResult = await deleteAccount(signInResult.data.token);
  expect(deleteAccountResult.success).toBe(true);

  const checkLoginTokenAfterDeleteResult = await checkLoginToken(
    createAccountResult.data.token
  );
  expect(checkLoginTokenAfterDeleteResult.success).toBe(false);
});

test('create an account + update email and password + signIn + delete', async () => {
  const email = 'test@test.com';
  const password = 'testtest';

  const createAccountResult = await createAuthAccount(email, password);
  expect(createAccountResult.success).toBe(true);

  if (!createAccountResult.success) throw createAccountResult.error;

  const updatedEmail = 'test2@test.com';
  const updatedPassword = 'test2test2';
  const updateEmailAndPasswordResult = await updateEmailAndPassword(
    createAccountResult.data.token,
    updatedEmail,
    updatedPassword
  );
  expect(
    updateEmailAndPasswordResult.success &&
      updateEmailAndPasswordResult.data.userId ===
        createAccountResult.data.userId
  ).toBe(true);
  if (!updateEmailAndPasswordResult.success)
    throw updateEmailAndPasswordResult.error;

  const checkLoginTokenResult = await checkLoginToken(
    updateEmailAndPasswordResult.data.token
  );
  expect(
    checkLoginTokenResult.success &&
      checkLoginTokenResult.data.email === updatedEmail
  ).toBe(true);

  const signInPreviousAccountResult = await signInWithEmailAndPassword(
    email,
    password
  );
  expect(signInPreviousAccountResult.success).toBe(false);

  const signInResult = await signInWithEmailAndPassword(
    updatedEmail,
    updatedPassword
  );
  expect(
    signInResult.success &&
      signInResult.data.userId === updateEmailAndPasswordResult.data.userId
  ).toBe(true);

  if (!signInResult.success) throw signInResult.error;

  const deleteAccountResult = await deleteAccount(signInResult.data.token);
  expect(deleteAccountResult.success).toBe(true);
});
