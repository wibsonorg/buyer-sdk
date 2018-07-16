import React, { Component } from "react";

import "./NumberInput.css";
import { ArrowUp, ArrowDown } from "../Icon/Icons";
import classnames from "classnames";

function handleKeyPress(event) {
  const keyCode = event.keyCode || event.which;
  const keyValue = String.fromCharCode(keyCode);
  if (!/[0-9]/.test(keyValue)) {
    event.preventDefault();
  }
}

function castBetween(min, max, value) {
  if (min != null && value < min) {
    return min;
  }
  if (max != null && value > max) {
    return max;
  }
  return value;
}

function nop() {}

class NumberInput extends Component {
  changeValue(step) {
    const newValue = castBetween(
      this.props.min,
      this.props.max,
      (Number(this.props.value) || 0) + step
    );
    this.props.onChange(newValue);

    // This would be nice, but it is not really officially supported:
    // this.textInput.value = newValue;

    // let event = new Event("input", { bubbles: true });
    // event.simulated = true;
    // this.textInput.dispatchEvent(event);
  }

  handleIncrement = () => {
    this.changeValue(this.props.step);
  };

  handleDecrement = () => {
    this.changeValue(-this.props.step);
  };

  render() {
    const { value, onChange, className, disabled } = this.props;
    return (
      <div className={classnames("wibson-number-input-container", className)}>
        <input
          ref={input => (this.textInput = input)}
          type="text"
          onKeyPress={handleKeyPress}
          onChange={ev =>
            onChange(ev.target.value === "" ? null : Number(ev.target.value))
          }
          className={classnames("wibson-number-input", disabled && "disabled")}
          value={value == null ? "" : value}
          disabled={disabled}
        />
        <div className="wibson-number-input-arrows">
          <div
            onClick={disabled ? nop : this.handleIncrement}
            className="wibson-number-input-arrow-container"
          >
            <ArrowUp className="wibson-number-input-up" />
          </div>
          <div
            onClick={disabled ? nop : this.handleDecrement}
            className="wibson-number-input-arrow-container"
          >
            <ArrowDown className="wibson-number-input-down" />
          </div>
        </div>
      </div>
    );
  }
}

NumberInput.defaultProperties = {
  step: 1,
  disabled: false
};

export default NumberInput;
