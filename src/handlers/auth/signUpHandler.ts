import { ClientSession } from 'mongoose';
import { createAuthAccount } from '../../services/authentification/firebaseAuth';
import Context from '../../structure/context';
import Handler from '../../structure/handler';
import { NavigationResult } from '../../structure/response';

export const signUpHandler = new Handler(
  async (
    context: Context,
    session: ClientSession
  ): Promise<NavigationResult<{ authToken: string }>> => {
    const email = context.body['email'] as string;
    const password = context.body['password'] as string;

    const registerResult = await createAuthAccount(email, password);
    if (!registerResult.success) {
      return {
        status: 400,
        body: {
          error: 'CANT_REGISTER_THAT_PROFILE',
        },
      };
    }
    return {
      status: 200,
      body: {
        authToken: registerResult.data.token,
      },
    };
  }
);
