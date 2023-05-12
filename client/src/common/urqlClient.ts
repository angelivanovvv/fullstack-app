import { fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";

import {
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
  UserDetailsDocument,
  UserDetailsQuery,
} from "../gql/graphql";

import { urqlUpdateQuery } from "./urqlUpdateQuery";

export const createUrlqClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  exchanges: [
    cacheExchange({
      updates: {
        Mutation: {
          logout: (logout_result, _args, cache, _info) => {
            urqlUpdateQuery<LogoutMutation, UserDetailsQuery>(
              cache,
              { query: UserDetailsDocument },
              logout_result,
              () => ({ userDetails: null })
            );
          },
          login: (login_result, _args, cache, _info) => {
            urqlUpdateQuery<LoginMutation, UserDetailsQuery>(
              cache,
              {
                query: UserDetailsDocument,
              },
              login_result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    userDetails: result.login.user,
                  };
                }
              }
            );
          },
          register: (register_result, _args, cache, _info) => {
            urqlUpdateQuery<RegisterMutation, UserDetailsQuery>(
              cache,
              {
                query: UserDetailsDocument,
              },
              register_result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    userDetails: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
  fetchOptions: {
    credentials: "include" as const,
  },
});
