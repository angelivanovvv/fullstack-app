import React from "react";
import { useRouter } from "next/router";

import { Box, Button } from "@chakra-ui/react";

import { useMutation } from "urql";
import { Formik, Form } from "formik";

import withUrql from "../hocs/urqlClient";

import { Wrapper } from "../components/Wrapper/Wrapper";
import { InputFIeld } from "../components/InputField/InputField";

import { RegisterDocument } from "../gql/graphql";
import { toErrorMap } from "../utils/toErrorMap";

import { ROUTES } from "../constants/routerConstants";

interface registerProps {}

type RegFormValues = {
  username: string;
  password: string;
};

export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();

  const formikState = { username: "", password: "" };

  const [{}, register] = useMutation(RegisterDocument);

  const onFormikSubmit = async (
    { username, password }: RegFormValues,
    props: any
  ) => {
    const response = await register({
      username,
      password,
    });
    if (response.data?.register.errors) {
      const errors = toErrorMap(response.data.register.errors);
      props.setErrors(errors);
    }
    if (response.data?.register.user) {
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
                Register
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default withUrql({ Component: Register, ssr: false });
