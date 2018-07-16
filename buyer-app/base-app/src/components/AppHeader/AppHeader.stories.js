import React from "react";

import { storiesOf } from "@storybook/react";

import AppHeader from "./AppHeader";

storiesOf("AppHeader", module)
  .add("Default", () =>
    <AppHeader name="john doe" userRole="seller" account="0x7511b74395cC03D2b4362910430d5fcdc77E2E4C" />
  )
  .add("With Panels", () => {
    const texts = ["Panel 1","Panel 2","Panel 3","Panel 4"];
    const style = {
      width: "326px",
      height: "169px",
      border: "1px solid grey",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };
    const panels = texts.map(text => <div style={style}>{text}</div>);

    return <AppHeader
      name="john doe"
      userRole="seller"
      account="0x7511b74395cC03D2b4362910430d5fcdc77E2E4C"
      panels={panels}
    />
  })
