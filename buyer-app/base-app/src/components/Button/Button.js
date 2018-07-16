import React from "react";
import cn from 'classnames/bind';
import styles from './Button.css';

const cx = cn.bind(styles);


/**
  Button props:

  - Button style:
    solid (Default)
    outline

  - Size:
    sm: small
    md: medium
    lg: large

*/
const Button = ({ children, type, buttonStyle, size, disabled, onClick, className, style }) => {
  const _disabled = (typeof disabled !== 'undefined' && disabled) ? "disabled" : "";

  return (
    <button
      type={type}
      className={cx('wibson-button', 'label', buttonStyle, size, _disabled, className)}
      style={style}
      onClick={() => onClick()}
      disabled={disabled}>
      {children && <span>{children}</span>}
    </button>
  );
};


Button.defaultProps = {
  children: '',
  type: 'button',
  buttonStyle: 'solid',
  size: 'md',
  disabled: false,
  onClick: () => {}
};

export default Button;
