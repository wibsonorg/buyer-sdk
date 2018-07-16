import React from "react";

import "./Checkbox.css";
import Check from "./check.svg";
import classnames from "classnames";

// TODO: box-sizing should be border box (now checkbox is slightly bigger than it should)

const Checkbox = ({ disabled, value, onChange }) => {
  return (
    <div
      onClick={() => onChange(!value)}
      className={classnames(
        "wibson-checkbox",
        value ? "wibson-checkbox-checked" : "wibson-checkbox-unchecked"
      )}
      disabled
    >
      {!value || <Check className="wibson-checkbox-checked-icon" />}
    </div>
  );
};

export default Checkbox;

