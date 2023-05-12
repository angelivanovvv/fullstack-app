import React from "react";
import { useRouter } from "next/router";

import { Box, Button } from "@chakra-ui/react";

import { useMutation } from "urql";
import { Formik, Form } from "formik";

import withUrql from "../hocs/urqlClient";

import { Wrapper } from "../components/Wrapper/Wrapper";
import { InputFIeld } from "../components/InputField/InputField";

import { LoginDocument } from "../gql/graphql";
import { toErrorMap } from "../utils/toErrorMap";

import { ROUTES } from "../constants/routerConstants";

interface loginProps {}

type RegFormValues = {
  username: string;
  password: string;
};

export const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();

  const formikState = { username: "", password: "" };

  const [_, login] = useMutation(LoginDocument);

  const onFormikSubmit = async (
    { username, password }: RegFormValues,
    props: any
  ) => {
    const response = await login({
      username,
      password,
    });
    if (response.data?.login.errors) {
      const errors = toErrorMap(response.data.login.errors);
      props.setErrors(errors);
    }
    if (response.data?.login.user) {
      router.push(ROUTES.HOME);
    }
    return response;
  };

  return (
    <Wrapper variant="small">
      <Formik initialValues={formikState} onSubmit={onFormikSubmit}>
        {({ values, handleChange, isSubmitting }) => {
          return (
            <Form>
              <InputFIeld
                name="username"
                placeholder="username"
                label="Username"
              />
              <Box mt={4}>
                <InputFIeld
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                Login
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrql({ Component: Login, ssr: false });
