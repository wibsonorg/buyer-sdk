import React from "react";
import classnames from "classnames";

import "./form.css";

const InfoItem = ({ children }) => (
  <div className="wibson-form-info-item">{children}</div>
);

const FormSection = ({ children }) => (
  <div className="wibson-form-form-section">{children}</div>
);

const InlineItem = ({ children, className }) => (
  <div className={classnames("wibson-form-info-item-inline", className)}>
    {children}
  </div>
);

const Form = ({ children, className }) => (
  <form className={classnames("wibson-form-container", className)}>
    {children}
  </form>
);

export { InfoItem, FormSection, InlineItem, Form };
