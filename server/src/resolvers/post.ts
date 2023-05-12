import { Arg, Ctx, Query, Resolver, Int, Mutation } from "type-graphql";

import { Post } from "../entities";
import { PostGQLType } from "../graphqlTypes";
import { MyContext } from "../types";

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

@Resolver()
export class PostResolver {
  //Query for reading all posts.
  @Query(() => [PostGQLType])
  async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    await sleep(3000);
    return em.find(Post, {});
  }
  //Query for reading single post.
  @Query(() => PostGQLType, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }
  //Mutation for creating a new post.
  @Mutation(() => PostGQLType)
  async createPost(
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title } as Post);
    await em.persistAndFlush(post);
    return post;
  }
  //Mutation for updating a post.
  @Mutation(() => PostGQLType)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof post !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }
  //Mutation for delete a post.
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(Post, { id });
    } catch (error) {
      return false;
    }
    return true;
  }
}
