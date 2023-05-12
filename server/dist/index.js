"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const core_1 = require("@mikro-orm/core");
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_1 = require("redis");
const cors_1 = __importDefault(require("cors"));
const resolvers_1 = require("./resolvers");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const constants_1 = require("./constants");
const main = async () => {
    const app = (0, express_1.default)();
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    let redisClient = (0, redis_1.createClient)();
    app.set("trust proxy", process.env.NODE_ENV !== "production");
    const whiteList = [
        "http://localhost:3000",
        "https://studio.apollographql.com",
    ];
    app.use((0, cors_1.default)({
        origin: whiteList,
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new connect_redis_1.default({
            client: redisClient,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: false,
            sameSite: "lax",
            secure: false,
        },
        resave: false,
        secret: "123456789",
        saveUninitialized: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [resolvers_1.UserResolver, resolvers_1.PostResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
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
//# sourceMappingURL=index.js.map