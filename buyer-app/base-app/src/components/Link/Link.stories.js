import React from "react";

import { storiesOf } from "@storybook/react";

import Link from "./Link";

storiesOf("Link", module)
  .add("Default", () => <Link>Hello!</Link>)
  .add("Disabled", () => <Link disabled>Hello!</Link>)
  .add("Extra Size: small", () => <Link size="sm">Hello!</Link>)
  .add("Extra Size: medium", () => <Link size="md">Hello!</Link>)
  .add("Extra Size: large", () => <Link size="lg">Hello!</Link>)
  .add("Extra Color: light", () => <Link color="light">Hello!</Link>)
  .add("Extra Color: light-dark", () => <Link color="light-dark">Hello!</Link>)
  .add("Extra Color: dark", () => <Link color="dark">Hello!</Link>)
