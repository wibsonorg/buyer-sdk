import React from "react";
import cn from 'classnames/bind';
import styles from './TextInput.css';

const cx = cn.bind(styles);


/**
  Input props:
  - Size:
    sm: small
    md: medium
    lg: large

*/
const TextInput = ({ name, type, id, placeholder, textInputStyle, size, 
                className, style, onChange, disabled, value }) => {
  return (
    <input
      name={name}
      type={type}
      id={id}
      placeholder={placeholder}
      required
      className={cx('wibson-text-input', textInputStyle, size, className)}
      style={style}
      onChange={() => onChange()}
      disabled={disabled}
      value={value}
    />
  );
};

TextInput.defaultProps = {
  name: '',
  type: 'text',
  id: name,
  placeholder: '',
  textInputStyle: '',
  size: '',
  onChange: () => {}
};

export default TextInput;