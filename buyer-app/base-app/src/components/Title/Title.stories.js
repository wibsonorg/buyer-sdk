import React from "react";
import { storiesOf } from "@storybook/react";
import Title from "./Title";

storiesOf("Title", module)
  .add("Default", () => <Title>Hello!</Title>)
  .add("Extra Color: light", () => <Title color="light">Hello!</Title>)
  .add("Extra Color: light-dark", () => <Title color="light-dark">Hello!</Title>)
  .add("Extra Color: dark", () => <Title color="dark">Hello!</Title>)
