import React from "react";

import { storiesOf } from "@storybook/react";

import TagList from "./TagList";

storiesOf("TagList", module)
  .add("Default", () => (
    <TagList labels={["Tag 1", "Tag 2", "Tag 3", "Tag 4"]} />
  ))
  .add("Empty list with fallback label", () => (
    <TagList labels={[]} emptyLabel="Everyone" />
  ))
  .add("List with hints", () => (
    <TagList
      tags={[
        { label: "Tag 1", hint: "Tag 1 tooltip" },
        { label: "Tag 2", hint: "Tag 2 tooltip" },
        { label: "Tag 3", hint: "Tag 3 tooltip" },
        { label: "Tag 4", hint: "Tag 4 tooltip" }
      ]}
    />
  ));
