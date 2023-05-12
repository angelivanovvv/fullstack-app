import React from "react";
import { AppProps } from "next/app";
import { withUrqlClient } from "next-urql";

import { createUrlqClient } from "../common/urqlClient";

type WithUrqlProps = {
  Component: any;
  ssr: boolean;
};

const withUrql = ({ Component, ssr = false }: WithUrqlProps) => {
  return withUrqlClient(createUrlqClient, { ssr })(Component);
};

export default withUrql;
