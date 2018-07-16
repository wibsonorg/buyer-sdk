import React from "react";
import PropTypes from "prop-types";

import "./SelectItem.css";

const SelectItem = ({ value, label, children, onClick }) => {
  return (
    <div
      className="wibson-select-item"
      onClick={() => onClick(value)}
      value={value}
    >
      {children || label}
    </div>
  );
};

SelectItem.propTypes = {
  value: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default SelectItem;
