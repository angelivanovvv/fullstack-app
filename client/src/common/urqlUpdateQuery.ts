import { Cache, QueryInput } from "@urql/exchange-graphcache";

export function urqlUpdateQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  fn: (result: Result, query: Query) => Query
) {
  return cache.updateQuery(queryInput, (data: any): any => {
    return fn(result, data);
  });
}
