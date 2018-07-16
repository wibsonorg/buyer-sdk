import React from "react";
import { storiesOf } from "@storybook/react";
import Label from "./Label";

storiesOf("Label", module)
  .add("Default", () => <Label>Hello!</Label>)
  .add("Extra Color: light", () => <Label color="light">Hello!</Label>)
  .add("Extra Color: light-dark", () => <Label color="light-dark">Hello!</Label>)
  .add("Extra Color: dark", () => <Label color="dark">Hello!</Label>)
  .add("Extra Weight: regular", () => <Label weight="regular">Hello!</Label>)
  .add("Extra Weight: bold", () => <Label weight="bold">Hello!</Label>)
