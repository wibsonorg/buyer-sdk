import React from "react";

import { storiesOf } from "@storybook/react";

import Loading from "./Loading";

storiesOf("Loading", module)
  .add("Default", () => <Loading />)
  .add("With Label", () => <Loading label="Waiting for confirmation..." />)
  .add("Extra small", () => <Loading size="xs" label="Waiting for confirmation..." />)
  .add("Extra large", () => <Loading size="xl" label="Waiting for confirmation..." />)
  .add("Not centered", () => <Loading size="xs" center={false} />)
