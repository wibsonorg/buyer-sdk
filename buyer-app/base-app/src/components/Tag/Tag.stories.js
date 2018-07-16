import React from "react";

import { storiesOf } from "@storybook/react";

import Tag from "./Tag";

storiesOf("Tag", module)
  .add("Default", () => <Tag label="Hello World" hint="This is a hint"/>)
