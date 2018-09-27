import React from "react";
import { storiesOf } from "@storybook/react";
import TextInput from "./TextInput";

storiesOf("TextInput", module)
  .add("Default", () => <TextInput/>)
  .add("Disabled", () => <TextInput disabled/>)
  .add("Extra Size: small", () => <TextInput size="sm"/>)
  .add("Extra Size: medium", () => <TextInput size="md"/>)
  .add("Extra Size: large", () => <TextInput size="lg"/>)