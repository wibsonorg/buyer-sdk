import React from "react";

import "./Panel.css";

const Panel = ({ children, title, width, height, onClick }) => {
  return (
    <div className="wibson-panel" style={{ width: width, height: height }}>
      {title && <div className="wibson-panel-title">{title}</div>}
      {children && <div>{children}</div>}
    </div>
  );
};

export default Panel;
