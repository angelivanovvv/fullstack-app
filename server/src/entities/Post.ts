import { Entity, Property, PrimaryKey } from "@mikro-orm/core";

//Database entity schema for table "Post".
@Entity()
export class Post {
  @PrimaryKey()
  id!: number;
  @Property({ type: "date" })
  createdAt: Date = new Date();
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
  @Property({ type: "text" })
  title!: string;
}
