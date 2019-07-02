import React from "react";
import PropTypes from 'prop-types';
import cn from "classnames/bind";
import styles from "./Tooltip.css";

const cx = cn.bind(styles);

const Tooltip = ({ direction, children, position, style }) => {
  return (
    <div
      className={cx("wibson-tooltip", direction.split(" "), "visible")}
      style={{...position, ...style}}
    >
      {children}
    </div>
  );
};

Tooltip.defaultProps = {
  position: { top: 0, left: 0 },
  direction: "right",
  style: {}
};

Tooltip.propTypes = {
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  }),
  style: PropTypes.object,
  children: PropTypes.node,
  direction: PropTypes.oneOf([
    "left",
    "right",
    "up",
    "down",
    "up left",
    "up right",
    "down left",
    "down right"
  ]),
  visible: PropTypes.bool
};

export default Tooltip;
