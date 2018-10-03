import React from "react";
import ReactModal from "react-modal";

import "./Modal.css";

import Icon from "../Icon";

import classnames from "classnames";

const Modal = ({ children, style, isOpen, onRequestClose, className }) => (
  <ReactModal
    isOpen
    onRequestClose={onRequestClose}
    overlayClassName="wibson-modal-overlay"
    className={classnames("wibson-modal-content", className)}
    style={{ content: style }}
  >
    <Icon
      className="wibson-modal-close-icon"
      icon="Close"
      size="sm"
      onClick={onRequestClose}
    />
    {children}
  </ReactModal>
);

const ModalTitle = ({ children, className }) => (
  <div className={classnames("wibson-modal-title", className)}>{children}</div>
);

const ModalContent = ({ children, className }) => (
  <div className={classnames("wibson-modal-inside-content", className)}>
    {children}
  </div>
);

export { ModalTitle, ModalContent };
export default Modal;
