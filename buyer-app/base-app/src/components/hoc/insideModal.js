import React from "react";
import Modal from "../Modal";

const insideModal = InnerComponent => ({ onRequestClose, style, ...props }) => (
  <Modal isOpen onRequestClose={onRequestClose} style={style}>
    <InnerComponent onRequestClose={onRequestClose} {...props} />
  </Modal>
);
export default insideModal;
