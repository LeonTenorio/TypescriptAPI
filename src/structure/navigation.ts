import { Express, Request, Response } from 'express';
import { ClientSession, Db } from 'mongodb';
import { DatabaseService, withDatabaseTransaction } from '../config/database';
import { checkLoginToken } from '../services/authentification/firebaseAuth';
import Context from './context';
import { DatabaseResult } from './databaseResult';
import Handler from './handler';
import { OperationResult } from './response';

export type NavigationResult<T> = OperationResult<T>;

export default class Navigation {
  handlers: Array<Handler<any>>;

  constructor(handlers: Array<Handler<any>>) {
    this.handlers = handlers;
  }

  async navigate(context: Context): Promise<
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
    for (let i = 0; i < this.handlers.length; i++) {
      try {
        const handler: Handler<any> = this.handlers[i];
        const result = await handler.run(context);

        if (result !== null) {
          return { ...result, success: true };
        }
      } catch (e) {
        return {
          success: false,
          error: e as Error,
        };
      }
    }

    return { error: Error('Handlers without response'), success: false };
  }
}

export const ProtectedNavigation = <T>(
  handlers: Array<Handler<any>>,
  getProfile: (
    userId: string,
    email: string,
    session: ClientSession,
    db: Db
  ) => Promise<DatabaseResult<T | null>>,
  roleFunction?: (profile: T) => boolean
) => {
  return new Navigation([
    new Handler(async (context: Context): Promise<NavigationResult<null>> => {
      const authToken = context.getAuthToken();
      if (authToken === null)
        return {
          status: 401,
          body: {
            error: 'REQUEST_WITHOUT_TOKEN',
          },
        };
      const authResult = await checkLoginToken(authToken);
      if (!authResult.success) {
        return {
          status: 401,
          body: {
            error: 'INVALID_TOKEN',
          },
        };
      }

      const service: DatabaseService<NavigationResult<null>> = async (
        db,
        session
      ) => {
        const profileResult = await getProfile(
          authResult.data.userId,
          authResult.data.email,
          session,
          db
        );
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
      };

      return await withDatabaseTransaction(service);
    }),
    ...handlers,
  ]);
};
