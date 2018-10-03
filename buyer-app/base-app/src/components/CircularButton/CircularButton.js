import React from "react";
import cn from 'classnames/bind';
import styles from './CircularButton.css';
import Label from '../Label';

const cx = cn.bind(styles)

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
const CircularButton = ({ label, labelColor, icon, buttonStyle, size, disabled, onClick, className, style}) => {
  const _disabled = (typeof disabled !== 'undefined' && disabled) ? "disabled" : "";
  return (
    <div className="wibson-circular-button">
      <button
        type="button"
        className={cx('button', size, buttonStyle, _disabled, className)}
        style={style}
        onClick={() => onClick()}
        disabled={disabled}>
          { icon }
      </button>
      {
        label &&
        <span className="label">
          <Label weight='regular' color={labelColor}>{label}</Label>
        </span>
      }
    </div>
  );
};


CircularButton.defaultProps = {
  icon: '',
  label: '',
  labelColor: 'dark',
  buttonStyle: 'solid',
  size: 'sm',
  disabled: false,
  onClick: () => {}
};

export default CircularButton;
