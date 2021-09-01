require('dotenv').config();

import {
  checkLoginToken,
  createAuthAccount,
  deleteAccount,
  signInWithEmailAndPassword,
  signOutAllAcounts,
} from './firebaseAuth';
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
  expect(checkLoginTokenResult.success).toBe(true);

  const deleteAccountResult = await deleteAccount(
    createAccountResult.data.token
  );
  expect(deleteAccountResult.success).toBe(true);
});

test('create an account + revoke token + signIn + delete account', async () => {
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
  expect(signInResult.success).toBe(true);
  if (!signInResult.success) throw signInResult.error;

  const deleteAccountResult = await deleteAccount(signInResult.data.token);
  expect(deleteAccountResult.success).toBe(true);
});
