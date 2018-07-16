import React from "react";

import ReactTooltip from "react-tooltip";
import cn from "classnames/bind";
import styles from "./Tag.css";
const cx = cn.bind(styles);

const Tag = ({ label, hint }) => {
  return (
    <div className={cx("wibson-tag")} data-tip={hint}>
      <label>{label}</label>
      <ReactTooltip/>
    </div>
  );
};

export default Tag;
