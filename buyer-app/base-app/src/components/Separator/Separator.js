import React from "react";

import cn from "classnames/bind";
import styles from "./Separator.css";
const cx = cn.bind(styles);

const Separator = ({ label }) => {
  return <div className={cx("wibson-separator")} />;
};

export default Separator;
