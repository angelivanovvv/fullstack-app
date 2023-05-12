import { Entity, Property, PrimaryKey } from "@mikro-orm/core";

//Database entity schema for table "User".
@Entity()
export class User {
  @PrimaryKey()
  id!: number;
  @Property({ type: "date" })
  createdAt: Date = new Date();
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();
  @Property({ type: "text", unique: true })
  username!: string;
  @Property({ type: "text" })
  password!: string;
}
