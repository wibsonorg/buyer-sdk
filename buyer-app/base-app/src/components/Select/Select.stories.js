import React, { Component } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Select from "./Select";
import SelectItem from "./SelectItem";
import Modal, { ModalContent, ModalTitle } from "../Modal";

class SelectStory_1 extends Component {
  render() {
    return (
      <Select value={2} placeHolder="Select...">
        <SelectItem value={1} label="One" onClick={action("click 1")} />
        <SelectItem value={2} label="Two" onClick={action("click 2")} />
        <SelectItem value={3} label="Three" onClick={action("click 3")} />
      </Select>
    );
  }
}

class SelectStory_Controlled extends Component {
  state = {
    value: 1
  };

  handleClick = value => {
    this.setState({ value });
  };

  render() {
    return (
      <Select value={this.state.value} placeHolder="Select...">
        <SelectItem
          value={1}
          label="Available data orders"
          onClick={this.handleClick}
        />
        <SelectItem value={2} label="Two" onClick={this.handleClick} />
        <SelectItem value={3} label="Three" onClick={this.handleClick} />
      </Select>
    );
  }
}

class SelectStory_Modal extends Component {
  state = {
    value: 1
  };

  handleClick = value => {
    this.setState({ value });
  };

  render() {
    return (
      <Modal isOpen>
        <ModalTitle>A Modal</ModalTitle>
        <ModalContent>
          <Select value={this.state.value} placeHolder="Select...">
            <SelectItem
              value={1}
              label="Available data orders"
              onClick={this.handleClick}
            />
            <SelectItem value={2} label="Two" onClick={this.handleClick} />
            <SelectItem value={3} label="Three" onClick={this.handleClick} />
          </Select>
        </ModalContent>
      </Modal>
    );
  }
}

storiesOf("Select", module)
  .add("Basic Select", () => <SelectStory_1 />)
  .add("Controlled Select", () => <SelectStory_Controlled />)
  .add("Select inside a Modal", () => <SelectStory_Modal />);
