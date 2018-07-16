import React from "react";
import { storiesOf } from "@storybook/react";
import Subtitle from "./Subtitle";

storiesOf("Subtitle", module)
  .add("Default", () => <Subtitle>Hello!</Subtitle>)
  .add("Extra Color: light", () => <Subtitle color="light">Hello!</Subtitle>)
  .add("Extra Color: light-dark", () => <Subtitle color="light-dark">Hello!</Subtitle>)
  .add("Extra Color: dark", () => <Subtitle color="dark">Hello!</Subtitle>)
