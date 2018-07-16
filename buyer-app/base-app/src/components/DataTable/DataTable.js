import React, { Component } from "react";

import cn from "classnames/bind";
import styles from "./DataTable.css";
const cx = cn.bind(styles);

import { ArrowUp, ArrowDown } from "../Icon/Icons";

import R from "ramda";

const defaultSortFunction = (x, y) => x - y;

function renderCell(row, value, renderer = value => value) {
  return renderer(value, row);
}

function getSortFunction(columns, sortBy) {
  const column = R.find(R.propEq("name", sortBy));
  return column.sortFunction || defaultSortFunction;
}

class DataTable extends Component {
  constructor(opts) {
    super(opts);
    this.state = {
      sortBy: this.props.defaultSortBy,
      sortDirection: this.props.defaultSortDirection || 1,
      sortFunction: this.props.defaultSortBy
        ? getSortFunction(this.props.columns, this.props.defaultSortBy)
        : null
    };
  }

  handleHeaderClick = (columnName, sortable, sortFunction) => {
    if (sortable) {
      this.setState({
        sortBy: columnName,
        sortDirection: -1 * this.state.sortDirection,
        sortFunction: sortFunction || defaultSortFunction
      });
    }
  };

  renderSortArrow(sortBy, sortDirection, name) {
    if (sortBy === name) {
      if (sortDirection > 0) {
        return <ArrowUp />;
      } else {
        return <ArrowDown />;
      }
    }
  }

  render() {
    const { fullWidth, columns, data } = this.props;
    const { sortBy, sortDirection, sortFunction, className } = this.state;

    const sortedData = sortBy
      ? R.sort(
          R.compose(R.multiply(sortDirection), (a, b) =>
            sortFunction(a[sortBy], b[sortBy])
          )
        )(data)
      : data;

    return (
      <table className={cx("wibson-data-table", className, { fullWidth })}>
        <thead>
          <tr>
            {columns.map(
              ({ label, sortable, sortFunction, name, width }, idx) => (
                <th
                  width={width}
                  style={sortable ? { cursor: "pointer" } : {}}
                  onClick={() =>
                    this.handleHeaderClick(name, sortable, sortFunction)
                  }
                  key={idx}
                >
                  <div className="wibson-data-table-header-value">{label}</div>
                  <div className="wibson-data-table-sort-arrow">
                    {this.renderSortArrow(sortBy, sortDirection, name)}
                  </div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx}>
              {columns.map(({ name, renderer }, idx) => (
                <td key={idx}>{renderCell(row, row[name], renderer)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

DataTable.defaultProps = {
  fullWidth: true
};

export default DataTable;
