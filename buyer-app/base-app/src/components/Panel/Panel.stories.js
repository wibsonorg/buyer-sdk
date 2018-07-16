import React from "react";

import { storiesOf } from "@storybook/react";

import Panel from "./Panel";

storiesOf("Panel", module)
  .add("Default", () => <Panel>Hello!</Panel>)
  .add("With dark background", () => (
    <div style={{padding: '24px', backgroundColor: '#0f2f4d'}}>
      <Panel width="326" height="169">
        <span style={{color: '#fff' }}>Hello!</span>
      </Panel>
    </div>
  ))
  .add("Extra width & height", () => <Panel width="326" height="169">Hello!</Panel>)
