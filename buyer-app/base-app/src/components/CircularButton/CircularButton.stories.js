import React from "react";

import { storiesOf } from "@storybook/react";

import CircularButton from "./CircularButton";
import Icon from "../Icon"

storiesOf("CircularButton", module)
  .add("Default (Style: Solid)", () => <CircularButton icon={<Icon icon="Plus" size="md" />} label="Hello"/>)
  .add("Button Style: Outline", () => <CircularButton buttonStyle="outline" icon={<Icon icon="Plus" size="md" />} label="Hello"/>)
