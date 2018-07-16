import React from 'react';
import cn from 'classnames/bind';
import styles from './Label.css';

const cx = cn.bind(styles);

/**
  Colors:
    - light
    - light-dark
    - dark

  Weight:
    - regular
    - bold

  Size:
    - sm: small
    - md: medium
    - lg: large
 */

const Label = ({ children, size, color, weight, className, style }) => {
  const _color = "color-" + color;
  return (
    <span className={cx('wibson-label', weight, size, className, _color)} style={style}>
      {children}
    </span>
  )
};

Label.defaultProps = {
  color: 'dark',
  weight: 'bold',
  size: 'sm',
  children: ''
};

export default Label;
