import React from 'react';
import cn from 'classnames/bind';
import styles from './Subtitle.css';

const cx = cn.bind(styles);

/**
  Colors:
    - light
    - light-dark
    - dark
 */

const Subtitle = ({ children, color, className, style }) => {
  const _color = "color-" + color;
  return (
    <span className={cx('wibson-subtitle', className, _color)} style={style}>
      {children}
    </span>
  )
};

Subtitle.defaultProps = {
  color: 'dark',
  children: ''
};

export default Subtitle;
