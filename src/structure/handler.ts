import { Express, Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import Context from './context';
import { NavigationResult } from './navigation';

type HandlerType<Context, NavigationResult> = (
  context: Context,
  session: ClientSession
) => Promise<NavigationResult>;

export default class Handler<T> {
  function: HandlerType<Context, NavigationResult<T>>;

  constructor(handler: HandlerType<Context, NavigationResult<T>>) {
    this.function = handler;
  }

  run(context: Context, session: ClientSession): Promise<NavigationResult<T>> {
    return this.function(context, session);
  }
}
