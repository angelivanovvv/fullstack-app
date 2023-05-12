import {
  Arg,
  Ctx,
  Field,
  InputType,
  Query,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import argin2 from "argon2";

import { User } from "../entities";

import { MyContext } from "../types";
import { UserGQLType } from "../graphqlTypes";

import { errorGenerator } from "../utils/errorUtils";

import { COOKIE_NAME } from "../constants";

//InputType definition when you have multiple "@Arg" options.
//Instead adding them one by one you can unite all args.
@InputType()
class UserDetailsInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

//ObjectType for "FieldError" when user isn't found.
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

//ObjectType for user response.
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => UserGQLType, { nullable: true })
  user?: UserGQLType;
}

@Resolver()
export class UserResolver {
  // Query for getting user details if user is logged
  @Query(() => UserGQLType, { nullable: true })
  async userDetails(@Ctx() { req, em }: MyContext): Promise<User | null> {
    if (!req.session!.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session!.userId });
    return user;
  }

  // Query for reading all users register
  @Query(() => [UserGQLType])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }
  // Mutation for registering user
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserDetailsInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [errorGenerator("username", "username must be greater then 2")],
      };
    }
    if (options.password.length <= 3) {
      return {
        errors: [errorGenerator("password", "password must be greater then 2")],
      };
    }
    const hashedPassword = await argin2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    } as User);

    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === "23505") {
        return {
          errors: [errorGenerator("username", "username already taken")],
        };
      }
    }
    req.session!.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UserDetailsInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [errorGenerator("username", "that username doesn't exist")],
      };
    }
    const validPassword = await argin2.verify(user.password, options.password);

    if (!validPassword) {
      return {
        errors: [errorGenerator("password", "incorrect password")],
      };
    }

    req.session!.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    res.clearCookie(COOKIE_NAME);
    return new Promise((resolve) => {
      req.session?.destroy((error) => {
        if (error) {
          console.log(error);
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }
}
