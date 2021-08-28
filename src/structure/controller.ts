import { Express, Request, Response } from "express";
import Context from "./context";
import Navigation from "./navigation";
import mongoose, { ClientSession } from "mongoose";

export default class Controller {
  async runNavigation(navigation: Navigation, req: Request, res: Response) {
    const context: Context = new Context(req);
    const session: ClientSession = await mongoose.connection.startSession();
    session.startTransaction();
    const handlersResponse = await navigation.navigate(context, session);
    if (handlersResponse.success) {
      if (handlersResponse.status < 400) {
        await session.commitTransaction();
      } else {
        await session.abortTransaction();
      }
      session.endSession();
      res.status(handlersResponse.status).send(handlersResponse.body);
    } else {
      console.warn("ERROR");
      console.warn(handlersResponse.error.message);
      await session.abortTransaction();
      res.status(500).send({});
    }
  }
}
