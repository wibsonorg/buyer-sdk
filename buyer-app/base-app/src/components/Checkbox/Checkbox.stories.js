import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Checkbox from "./Checkbox";

class Checkbox_Story extends Component {
  state = {
    value: false
  };
  render() {
    return (
      <div>
        A checkbox:{" "}
        <Checkbox
          value={this.state.value}
          onChange={value => this.setState({ value })}
        />
      </div>
    );
  }
}

storiesOf("Checkbox", module).add("Basic checkbox", () => <Checkbox_Story />);
