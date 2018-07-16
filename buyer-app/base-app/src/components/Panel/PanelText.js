import React from "react";

import cn from "classnames/bind";
import styles from "./Panel.css";

const cx = cn.bind(styles);

const PanelText = ({ children }) => (
  <div className={cx("panel-text")}> {children}</div>
);

export default PanelText;
