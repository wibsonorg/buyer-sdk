import React from 'react';
import cn from 'classnames/bind';
import styles from './Title.css';

const cx = cn.bind(styles);

/**
  Colors:
    - light
    - light-dark
    - dark
 */

const Title = ({ children, color, className, style }) => {
  const _color = "color-" + color;
  return (
    <span className={cx('wibson-title', className, _color)} style={style}>
      {children}
    </span>
  )
};

Title.defaultProps = {
  color: 'dark',
  children: ''
};

export default Title;
