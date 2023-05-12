import "reflect-metadata";

import express from "express";
import session from "express-session";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MikroORM } from "@mikro-orm/core";

import RedisStore from "connect-redis";
import { createClient } from "redis";
import cors from "cors";

import { UserResolver, PostResolver } from "./resolvers";

import { MyContext } from "./types";

import mikroConfig from "./mikro-orm.config";
import { COOKIE_NAME, __prod__ } from "./constants";

const main = async () => {
  // Initialize express app.
  const app = express();

  // Init MikroORM (PostgresQL database).
  const orm = await MikroORM.init(mikroConfig);

  // Initialize client.
  // To use redisClient you need to have installed redis server on your machine.
  // After that you need to start server.
  // After this you can initialize the client and connect to the server.
  let redisClient = createClient();

  // Set trust proxy for setting cookies on browser side.
  app.set("trust proxy", process.env.NODE_ENV !== "production");

  // White list containing all domains allowed to access server.
  const whiteList = [
    "http://localhost:3000",
    "https://studio.apollographql.com",
  ];

  // Init cors options.
  // This config will work for all routes.
  app.use(
    cors({
      origin: whiteList,
      credentials: true,
    })
  );

  // Initialize sesssion storage.
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: false,
        // Set "none" to work "https://studio.apollographql.com/"
        // Set "lax" to work for your app instance
        sameSite: "lax",
        // Set "true" to work "https://studio.apollographql.com/"
        // Set "false" to work for your app instance
        secure: false, //cookie only works in https
      },
      resave: false, // required: force lightweight session keep alive (touch)
      secret: "123456789",
      saveUninitialized: false, // recommended: only save session when data exists
    })
  );

  // Configurate ApolloServer.
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
  });

  // Start ApolloServer.
  await apolloServer.start();

  // Apply middlewares to ApolloSerer.
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // Run entire server when MikroORM is connected.
  orm
    .getMigrator()
    .up()
    .then(() => {
      console.log("MikroORM connected!");
    })
    .then(() => {
      redisClient
        .connect()
        .then(() => console.log("redis connected!!!"))
        .catch(() => console.log("redis disconnected!!!"));
    })
    .then(() => {
      app.listen(4000, () => {
        console.log("Server started on localhost: 4000");
      });
    });
};

main();
