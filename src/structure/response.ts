import { Express, Request, Response } from "express";

export type NavigationResult<T> =
  | {
      status: 200 | 201 | 202 | 203 | 204 | 205;
      body: T;
    }
  | {
      status: 400 | 401 | 402 | 403 | 404 | 405;
      body: { error: string };
    }
  | null;
