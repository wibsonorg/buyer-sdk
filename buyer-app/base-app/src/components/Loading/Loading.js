import React from "react";
import cn from 'classnames/bind';
import MainLoading from './MainLoading.svg';

import styles from './Loading.css';
const cx = cn.bind(styles);

// TODO: Change common label object for some ui-specific text component
const Loading = ({ label, size, center, className, style }) => (
  <div className={cx('wibson-loading', size, { center }, className)} style={style}>
    <MainLoading className="wibson-loading-svg" />
    {label && <label className="wibson-loading-label">{label}</label>}
  </div>
);

Loading.defaultProps = {
  label: undefined,
  size: "md",
  center: true,
  className: "",
  style: undefined
};

export default Loading;
