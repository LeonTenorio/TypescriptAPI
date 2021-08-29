import { Express, Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import Context from './context';
import { DatabaseResult } from './databaseResult';
import Handler from './handler';
import { NavigationResult } from './response';

export default class Navigation {
  handlers: Array<Handler<any>>;
  authHandler?: Handler<any>;

  constructor(handlers: Array<Handler<any>>, authHandler?: Handler<any>) {
    this.handlers = handlers;
    this.authHandler = authHandler;
  }

  async navigate(
    context: Context,
    session: ClientSession
  ): Promise<
    | {
        success: true;
        status: number;
        body: any;
      }
    | {
        success: false;
        error: Error;
      }
  > {
    try {
      if (this.authHandler !== undefined) {
        const handler: Handler<any> = this.authHandler;
        const result = await handler.run(context, session);
        if (result !== null) {
          return { ...result, success: true };
        }
      }
      for (let i = 0; i < this.handlers.length; i++) {
        const handler: Handler<any> = this.handlers[i];
        const result = await handler.run(context, session);
        if (result !== null) {
          return { ...result, success: true };
        }
      }
    } catch (e) {
      // TODO: Check that type cast
      return { error: e as Error, success: false };
    }
    return { error: Error('Handlers without response'), success: false };
  }
}

export const ProtectedNavigation = <T>(
  handlers: Array<Handler<any>>,
  getProfile: (
    token: string,
    session: ClientSession
  ) => Promise<DatabaseResult<T | null>>,
  roleFunction?: (profile: T) => boolean
) => {
  return new Navigation([
    new Handler(
      async (
        context: Context,
        session: ClientSession
      ): Promise<NavigationResult<null>> => {
        const authToken = context.getAuthToken();
        if (authToken === null)
          return {
            status: 401,
            body: {
              error: 'REQUEST_WITHOUT_TOKEN',
            },
          };
        const profileResult = await getProfile(authToken, session);
        if (!profileResult.success) {
          throw profileResult.error;
        }
        if (profileResult.data === null) {
          return {
            status: 404,
            body: {
              error: 'PROFILE_NOT_FOUND',
            },
          };
        }
        if (roleFunction !== undefined) {
          if (!roleFunction(profileResult.data)) {
            return {
              status: 403,
              body: {
                error: 'NOT_AUTHORIZED',
              },
            };
          }
        }
        context.setVariable<T>('profile', profileResult.data);

        return null;
      }
    ),
    ...handlers,
  ]);
};
