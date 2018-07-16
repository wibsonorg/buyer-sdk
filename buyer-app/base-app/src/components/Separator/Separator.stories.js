import React from "react";

import { storiesOf } from "@storybook/react";

import Separator from "./Separator";

storiesOf("Separator", module).add("Default", () => (
  <div>
    <div>Something</div>
    <Separator />
    <div>Something</div>
  </div>
));
