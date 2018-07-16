import React from 'react';
import cn from 'classnames/bind';
import * as Icons from './Icons';
import styles from './Icon.css';

const cx = cn.bind(styles);

const Icon = ({ icon, size, color, onClick, className, style }) => {

  const _style = {...style, fill: color};
  return React.createElement(Icons[icon], {
    onClick,
    className: cx('icon', size, className, { withHover: onClick }),
    style: _style,
  });
}


Icon.defaultProps = {
  size: 'sm',
  onClick: () => {},
  className: '',
  color: '#b8cfe6',
  style: undefined,
};

export default Icon;
