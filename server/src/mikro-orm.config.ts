import path from "path";
import { MikroORM } from "@mikro-orm/core";

import { Post, User } from "./entities";
import { __prod__ } from "./constants";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  allowGlobalContext: true,
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  user: "postgres",
  password: "root",
  debug: !__prod__!,
} as Parameters<typeof MikroORM.init>[0];