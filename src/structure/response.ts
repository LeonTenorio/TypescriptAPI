import { Express, Request, Response } from "express";

export type NavigationResult<T> = {
  status: number;
  body: T;
} | null;
