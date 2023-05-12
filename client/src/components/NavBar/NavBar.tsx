import React, { Fragment } from "react";
import NextLink from "next/link";
import { useQuery, useMutation } from "urql";

import { Button, Box, Flex } from "@chakra-ui/react";

import { UserDetailsDocument, LogoutDocument } from "../../gql/graphql";

import { ROUTES } from "../../constants/routerConstants";
import { isSSR } from "../../utils/isSSR";

import styles from "./NavBar.module.css";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const [{ data, fetching }] = useQuery({
    query: UserDetailsDocument,
    pause: isSSR(),
  });
  console.log("data: ", data);
  const [{ fetching: logoutFetching }, logout] = useMutation(LogoutDocument);

  let body = null;

  if (fetching) {
    body = null;
  } else if (!data?.userDetails) {
    body = (
      <Flex>
        <NextLink href={ROUTES.LOGIN}>
          <Box mr={2} color="white" className={styles.link}>
            Login
          </Box>
        </NextLink>
        <NextLink href={ROUTES.REGISTER}>
          <Box color="white" className={styles.link}>
            Register
          </Box>
        </NextLink>
      </Flex>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2} color="black" className={styles.username}>
          {`Welcome, ${data.userDetails.username}`}
        </Box>
        <Button
          color="white"
          variant="link"
          className={styles.link}
          isLoading={logoutFetching}
          onClick={() => {
            logout({});
          }}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tan" p={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
