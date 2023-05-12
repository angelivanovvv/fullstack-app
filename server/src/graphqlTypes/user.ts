import { Field, Int, ObjectType } from "type-graphql";

//GraphQL type for entity "User".
//This is how GraphQL understands the data coming from the entity.
@ObjectType()
export class UserGQLType {
  @Field(() => Int)
  id!: number;
  @Field(() => String)
  createdAt: Date = new Date();
  @Field(() => String)
  updatedAt: Date = new Date();
  @Field(() => String)
  username!: string;

  password!: string;
}
