require('dotenv').config();

import { createAuthAccount, deleteAccount } from './firebaseAuth';

test('create an account + delete account', async () => {
  const email = 'test@test.com';
  const password = 'testtest';

  const createAccountResult = await createAuthAccount(email, password);
  expect(createAccountResult.success).toBe(true);

  if (!createAccountResult.success) throw createAccountResult.error;

  const deleteAccountResult = await deleteAccount(
    createAccountResult.data.token
  );
  expect(deleteAccountResult.success).toBe(true);
});
