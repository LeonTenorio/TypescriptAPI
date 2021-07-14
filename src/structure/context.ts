import { Express, Request, Response } from "express";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export default class Context {
  hostname: string;
  url: string;
  body: object;
  method: Method;
  params: object;

  _variables: any;

  constructor(req: Request) {
    this.hostname = req.hostname;
    this.url = req.url;
    this.body = req.body;
    this.method = req.method as Method;
    if (this.method === undefined || this.method === null)
      throw Error("Invalid http method");
    this.params = { ...req.params, ...req.query };
    this._variables = new Object();
  }

  setVariable(key: string, variable: any) {
    this._variables[key] = variable;
  }

  getVariable(key: string): any {
    return this._variables[key];
  }
}