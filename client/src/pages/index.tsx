import React from "react";
import { useQuery } from "urql";

import { Box } from "@chakra-ui/react";

import withUrql from "../hocs/urqlClient";

import { NavBar } from "../components/NavBar/NavBar";

import { PostsDocument } from "../gql/graphql";

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const [{ data }] = useQuery({
    query: PostsDocument,
  });

  return (
    <Box>
      <NavBar />
      <div>Hello world</div>
      <br />
      {!data ? (
        <div>Loading...</div>
      ) : (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </Box>
  );
};

export default withUrql({ Component: Index, ssr: true });
