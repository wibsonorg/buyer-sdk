import React, { Component } from "react";

import { Portal } from "react-portal";

import "./Toast.css";

import Icon from "../Icon";

import classnames from "classnames";


const Notification = ({ children, onCloseRequested, status }) => {
  return (
    <div className={classnames("wibson-toast", `wibson-toast-status-${status}`)}>
      <div className="wibson-toast-content">{children}</div>
      <div onClick={onCloseRequested} className="wibson-toast-close-container">
        <Icon className="wibson-toast-close" icon="Close" size="xs" />
      </div>
    </div>
  );
};

Notification.defaultProps = {
  status: "ok"  // ok|critical|warning|disabled|unknown
}

class Toast extends Component {
  render() {
    const { children, onCloseRequested, status } = this.props;

    return (
      <Portal>
        <Notification onCloseRequested={onCloseRequested} status={status}>
          {children}
        </Notification>
      </Portal>
    );
  }
}

export default Toast;
