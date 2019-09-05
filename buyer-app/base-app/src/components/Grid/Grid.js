import React from "react";
import PropTypes from 'prop-types';

import "./Grid.css";
import cx from 'classnames';

export default class Grid extends React.Component {
  static propTypes = {
    columns: PropTypes.number.isRequired
  };

  modifyChildren = (child, idx, columns) => {
    if (child === undefined || child === null) {
      return undefined;
    }

    const style = Object.assign({}, child.props.style, {"flex": `0 0 ${100/columns}%`});

    const props = { key: idx, style };
    return React.cloneElement(child, props);
  }

  render() {
    const { className, columns } = this.props;
    return (
      <div className={cx('wibson-grid', className)}>
        {this.props.children.map((child, idx) => this.modifyChildren(child, idx, columns))}
      </div>
    );
  }
}
