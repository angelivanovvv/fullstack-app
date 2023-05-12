import { Field, Int, ObjectType } from "type-graphql";

//GraphQL type for entity "Post".
//This is how GraphQL understands the data coming from the entity.
@ObjectType()
export class PostGQLType {
  @Field(() => Int)
  id!: number;
  @Field(() => String)
  createdAt: Date = new Date();
  @Field(() => String)
  updatedAt: Date = new Date();
  @Field(() => String)
  title!: string;
}
