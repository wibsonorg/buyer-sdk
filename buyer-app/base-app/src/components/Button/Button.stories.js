import React from "react";

import { storiesOf } from "@storybook/react";

import Button from "./Button";

storiesOf("Button", module)
  .add("Default (Style: Solid)", () => <Button>Hello!</Button>)
  .add("Style: Outline", () => <Button buttonStyle="outline">Hello!</Button>)
  .add("Style: Bare", () => <Button buttonStyle="bare">Hello!</Button>)
  .add("Disabled", () => <Button disabled>Hello!</Button>)
  .add("Extra Size: small", () => <Button size="sm">Hello!</Button>)
  .add("Extra Size: medium", () => <Button size="md">Hello!</Button>)
  .add("Extra Size: large", () => <Button size="lg">Hello!</Button>)
