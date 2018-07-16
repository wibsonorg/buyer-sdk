import React from "react";
import cn from "classnames/bind";

import styles from "./Loading.css";
const cx = cn.bind(styles);

import Loading from "./Loading";

const LoadingPage = props => {
  return (
    <div className={cx("wibson-loading-full-page")}>
      <Loading size="xl" {...props} />
    </div>
  );
};

export default LoadingPage;
