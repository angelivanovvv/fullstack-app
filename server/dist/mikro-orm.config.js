"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const entities_1 = require("./entities");
const constants_1 = require("./constants");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        glob: "!(*.d).{js,ts}",
    },
    allowGlobalContext: true,
    entities: [entities_1.Post, entities_1.User],
    dbName: "lireddit",
    type: "postgresql",
    user: "postgres",
    password: "root",
    debug: !constants_1.__prod__,
};
//# sourceMappingURL=mikro-orm.config.js.map