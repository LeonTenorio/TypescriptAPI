import { Express, Request, Response } from "express";
import { ClientSession } from "mongoose";
import Context from "./context";
import Handler from "./handler";
import { NavigationResult } from "./response";

export default class Navigation {
  handlers: Array<Handler<any>>;

  constructor(handlers: Array<Handler<any>>) {
    this.handlers = handlers;
  }

  async navigate(
    context: Context,
    session: ClientSession
  ): Promise<
    | {
        sucess: true;
        status: number;
        body: any;
      }
    | {
        sucess: false;
        error: Error;
      }
  > {
    for (let i = 0; i < this.handlers.length; i++) {
      const handler: Handler<any> = this.handlers[i];
      try {
        const result = await handler.run(context, session);
        if (result !== null) {
          return { ...result, sucess: true };
        }
      } catch (e) {
        return { error: e, sucess: false };
      }
    }
    return { error: Error("Handlers without response"), sucess: false };
  }
}
