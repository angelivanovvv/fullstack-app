import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";

export type UserTypes = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
};

export type PostTypes = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
};

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
};
