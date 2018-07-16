import React from "react";
import { storiesOf } from "@storybook/react";
import Text from "./Text";

storiesOf("Text", module)
  .add("Default", () => <Text>Hello!</Text>)
  .add("Extra Weight: regular", () => <Text weight="regular">Hello!</Text>)
  .add("Extra Weight: bold", () => <Text weight="bold">Hello!</Text>)
  .add("Extra Size: sm", () => <Text size="sm">Hello!</Text>)
  .add("Extra Size: md", () => <Text size="md">Hello!</Text>)
  .add("Extra Size: lg", () => <Text size="lg">Hello!</Text>)
  .add("Extra Color: light", () => <Text color="light">Hello!</Text>)
  .add("Extra Color: light-dark", () => <Text color="light-dark">Hello!</Text>)
  .add("Extra Color: dark", () => <Text color="dark">Hello!</Text>)
