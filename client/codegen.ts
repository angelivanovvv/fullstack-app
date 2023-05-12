import type { CodegenConfig } from "@graphql-codegen/cli";

// GraphQL Code Generator is a plugin-based tool that helps you get the best out of your GraphQL stack.

// From back-end to front-end, GraphQL Code Generator automates the generation of:
// Typed Queries, Mutations and, Subscriptions for React, Vue, Angular, Next.js, Svelte, whether you are using Apollo Client, URQL or, React Query.
// Typed GraphQL resolvers, for any Node.js (GraphQL Yoga, GraphQL Modules, TypeGraphQL or Apollo) or Java GraphQL server.
// Fully-typed Node.js SDKs, Apollo Android support, and more!

// Config file for GraphQL code generator
const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: "src/graphql/**/*.graphql",
  ignoreNoDocuments: true,
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
