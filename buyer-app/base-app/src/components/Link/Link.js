import React from "react";
import cn from 'classnames/bind';
import styles from './Link.css';

const cx = cn.bind(styles);

const Link = ({ children, size, color, disabled, onClick, className, style }) => {
  const _disabled = (typeof disabled !== 'undefined' && disabled) ? "disabled" : "";
  const _color = "color-" + color;

  return (
    <button
      type='button'
      className={cx('wibson-link', 'label', size, _color, _disabled, className)}
      style={style}
      onClick={() => onClick()}
      disabled={disabled}>
      {children && <span>{children}</span>}
    </button>
  );
};

Link.defaultProps = {
  children: '',
  size: 'md',
  color: 'dark',
  disabled: false
};

export default Link;
