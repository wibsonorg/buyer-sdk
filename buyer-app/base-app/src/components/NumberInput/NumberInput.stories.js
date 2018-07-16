import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import NumberInput from "./NumberInput";

class NumberInput_Story extends Component {
  state = {
    value: 1
  };
  handleChange = value => {
    this.setState({ value });
  };
  render() {
    return (
      <div>
        A NumberInput:
        <NumberInput
          min={0}
          max={10}
          step={2}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

storiesOf("NumberInput", module).add("Basic NumberInput", () => (
  <NumberInput_Story />
));
