import React from "react";

import { withRouter } from "react-router";
import cn from "classnames/bind";

import Panel from "base-app-src/components/Panel";
import Text from "base-app-src/components/Text";
import Tooltip from "base-app-src/components/Tooltip";
import styles from "./panels.css";
import PropTypes from 'prop-types';

const cx = cn.bind(styles);

const currencyFormat = num =>
  num &&
  num
    .toFixed(0) // number of decimal digits
    .replace(".", ",") // replace decimal point character with ,
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

class BalancePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltips: this.props.currencies.reduce((obj, item) => {
        obj[item.currencyName] = false;
        return obj;
      }, {})
    };
  }

  handleToggleTooltip = tooltipName => {
    this.setState({
      ...this.state,
      tooltips: {
        ...this.state.tooltips,
        [tooltipName]: !this.state.tooltips[tooltipName]
      }
    });
  };

  tooltip = ({
    direction = "up left",
    top = -60,
    left = 0,
    position = "absolute",
    value,
    currencyName = "Wib"
  }) => {
    return (
      <Tooltip
        direction={direction}
        position={{ top, left, position }}
        style={this.state.tooltips[currencyName] ? {} : { display: "none" }}>
        <Text color="light-dark" size="sm">
          {value + " Wibson tokens"}
        </Text>
      </Tooltip>
    );
  };

  balances = (currencies, tooltip) => {
    return currencies.map(({ currencyName, value = 0 }, index) => (
      <div key={index} style={{ flex: 1 }}>
        <span
          onMouseEnter={
            tooltip && (() => this.handleToggleTooltip(currencyName))
          }
          onMouseLeave={
            tooltip && (() => this.handleToggleTooltip(currencyName))
          }
          className={cx("panel-text-balance")}>
          {currencyName !== "ETH"
            ? currencyFormat(value) + " " + currencyName
            : value + " " + currencyName}
        </span>
        {tooltip && (
          <div style={{ position: "relative" }}>
            {this.tooltip({ currencyName, value })}
          </div>
        )}
      </div>
    ));
  };

  render() {
    const { currencies, title, tooltip } = this.props;
    return (
      <Panel title={title}>
        <div className={cx("panel-balance")}>
          {this.balances(currencies, tooltip)}
        </div>
      </Panel>
    );
  }
}

BalancePanel.defaultProps = {
  currencies: [
    { currencyName: "Wib", value: 0 },
    { currencyName: "Eth", value: 0 }
  ]
};

BalancePanel.propTypes = {
  currencies: PropTypes.array,
  title: PropTypes.string
};

export default withRouter(BalancePanel);
