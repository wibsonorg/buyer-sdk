import React from "react";

import { compose } from "recompose";
import Link from "base-app-src/components/Link";
import Icon from "base-app-src/components/Icon";
import Panel from "base-app-src/components/Panel";
import Text from "base-app-src/components/Text";
import Tooltip from "base-app-src/components/Tooltip";
import { withRouter } from "react-router";

import { connect } from "react-redux";

import * as BalanceSelectors from "../../state/balance/selectors";


import {
  tradeDataTokenAtRate,
  shortenLargeNumber
} from "base-app-src/lib/balance";

import cn from "classnames/bind";
import styles from "./panels.css";
const cx = cn.bind(styles);

class BalancePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltip: false
    };
  }

  handleToggleTooltip = () => {
    this.setState({ showTooltip: !this.state.showTooltip });
  };

  render() {
    let balance = "N/A";
    let balanceScaled = balance;
    let balanceUSD = balance;

    const { history } = this.props;

    if (typeof this.props.balance !== "undefined") {
      balance = this.props.balance;
      balanceScaled = shortenLargeNumber(this.props.balance);
      balanceUSD =
        "$" +
        tradeDataTokenAtRate(this.props.balance, this.props.tokenDollarRate);
    }

    const style = this.state.showTooltip ? {} : { display: "none" };

    return (
      <Panel title="Balance">
        <div
          onMouseEnter={this.handleToggleTooltip}
          onMouseLeave={this.handleToggleTooltip}
        >
          <span className={cx("panel-text")}>{balanceUSD}</span>
          <span className={cx("panel-note")}>
            {"(" + balanceScaled + " WIB)"}
          </span>
          <div style={{ position: "relative" }}>
            <Tooltip
              direction="down"
              position={{ top: 0, left: 0, position: "absolute" }}
              style={style}
            >
              <Text color="light-dark" size="sm">
                {balance + " Wibson Coins"}
              </Text>
            </Tooltip>
          </div>
        </div>
        <Link color="light-dark" onClick={() => history.push("/cash-out")}>
          Cash out <Icon icon="ArrowRight" />
        </Link>
      </Panel>
    );
  }
}

BalancePanel.defaultProps = {
  balance: undefined
};

BalancePanel.propTypes = {
  balance: React.PropTypes.number
};

const mapStateToProps = state => {
  return { balance: BalanceSelectors.getTokensBalance(state) };
};

export default compose(withRouter, connect(mapStateToProps))(BalancePanel);
