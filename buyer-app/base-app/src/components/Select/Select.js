import React from "react";

import cn from 'classnames/bind';
import styles from './Select.css';
const cx = cn.bind(styles);

import TetherComponent from "react-tether";
import onClickOutside from "react-onclickoutside";
import { ArrowDown, ArrowUp } from "../Icon/Icons";
import classnames from "classnames";

const SelectValue = ({ children }) => (
  <div className="wibson-select-value">{children}</div>
);

const ExpandedOptions = onClickOutside(
  class extends React.Component {
    handleClickOutside = () => {
      this.props.onClickOutside();
    };

    render() {
      const { children, width, onClick, className } = this.props;
      return (
        <ul
          onClick={onClick}
          style={{ width }}
          className={cx("wibson-select-items-container", className)}
        >
          {children.map((el, idx) => <li key={idx}>{el}</li>)}
        </ul>
      );
    }
  }
);

class Select extends React.Component {
  state = {
    open: false
  };

  render() {
    const { placeHolder, value, children, className, itemsContainerClassName } = this.props;
    const { open } = this.state;

    const valueElement = children
      ? children.find(child => child.props.value === value)
      : undefined;

    return (
      <TetherComponent attachment="top center">
        <div ref={elem => this.elem = elem} className={classnames("wibson-select", className)} onClick={this.handleClick}>
          <SelectValue>
            {valueElement ? valueElement.props.label : placeHolder}
          </SelectValue>
          <div className="wibson-select-arrow">
            {open ? <ArrowUp /> : <ArrowDown />}
          </div>
        </div>
        {open && (
          <ExpandedOptions
            onClick={this.handleClick}
            onClickOutside={this.handleClick}
            width={this.getTargetWidth()}
            className={itemsContainerClassName}
          >
            {children}
          </ExpandedOptions>
        )}
      </TetherComponent>
    );
  }

  getTargetWidth = () => {
    const elem = this.elem;
    if (elem) {
      const { width } = elem.getBoundingClientRect();
      return width - 2;
    }
    return undefined;
  };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };
}
export default Select;
