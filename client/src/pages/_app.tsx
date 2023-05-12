import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";

import theme from "../theme";
import withUrql from "../hocs/urqlClient";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
