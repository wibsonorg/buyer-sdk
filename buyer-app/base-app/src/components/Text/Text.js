import React from 'react';
import cn from 'classnames/bind';
import styles from './Text.css';

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
    - lg: larg
 */

const Text = ({ children, size, weight, color, className, style }) => {
  const _color = "color-" + color;
  return (
    <span className={cx('wibson-text', size, weight, className, _color)} style={style}>
      {children}
    </span>
  )
};

Text.defaultProps = {
  size: 'md',
  weight: 'regular',
  color: 'dark',
  children: ''
};

export default Text;
