import React from "react";

import { compose } from "recompose";
import Link from "base-app-src/components/Link";
import Icon from "base-app-src/components/Icon";
import Panel from "base-app-src/components/Panel";
import Text from "base-app-src/components/Text";
import Tooltip from "base-app-src/components/Tooltip";
import { withRouter } from "react-router";

import { connect } from "react-redux";

import * as AccountSelectors from "state/entities/account/selectors";

import {
  shortenLargeNumber
} from "base-app-src/lib/balance";

import cn from "classnames/bind";
import styles from "./panels.css";
const cx = cn.bind(styles);

class BalancePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTooltipWib: false,
      showTooltipEther: false,
    };
  }

  handleToggleTooltip = (showTooltip) => {
    if (showTooltip === 'showTooltipWib'){
      this.setState({ showTooltipWib: !this.state.showTooltipWib, showTooltipEther: false });
    }
    if (showTooltip === 'showTooltipEther'){
      this.setState({ showTooltipWib: false, showTooltipEther: !this.state.showTooltipEther });
    }
  };

  render() {
    let balance ="N/A";
    let balanceScaled = balance;
    let ether = "N/A";
    let wib = "N/A";

    const { history } = this.props;

    if (typeof this.props.balance !== "undefined") {
      balance = this.props.balance;
      balanceScaled = shortenLargeNumber(balance, 2);
    }

    if (typeof this.props.wib !== "undefined") {
      wib = this.props.wib;
    }

    if (typeof this.props.ether !== "undefined") {
      ether = this.props.ether;
    }

    const styleWib = this.state.showTooltipWib ? {} : { display: "none" };
    const styleEther = this.state.showTooltipEther ? {} : { display: "none" };

    return (
      <Panel title="Balance">
      <div className={cx("panel-balance")}>
        <div
          onMouseEnter={()=>(this.handleToggleTooltip("showTooltipWib"))}
          onMouseLeave={()=>(this.handleToggleTooltip("showTooltipWib"))}
        >
          <span className={cx("panel-text-balance")}>{`WIB ${wib}`}</span>
          <span className={cx("panel-note")}>
            {"(" + balanceScaled + " WIB)"}
          </span>
          <div style={{ position: "relative" }}>
            <Tooltip
              direction="up left"
              position={{ top: -60, left: 50, position: "absolute" }}
              style={styleWib}
            >
              <Text color="light-dark" size="sm">
                {balance + " Wibson tokens"}
              </Text>
            </Tooltip>
          </div>
        </div>
        <div
          onMouseEnter={()=>(this.handleToggleTooltip("showTooltipEther"))}
          onMouseLeave={()=>(this.handleToggleTooltip("showTooltipEther"))}
        >
          <span className={cx("panel-text-eth-balance")}>{`ETH ${ether.toFixed(4)}`}</span>
          <div style={{ position: "relative" }}>
            <Tooltip
              direction="down"
              position={{ top: 0, left: 55, position: "absolute" }}
              style={styleEther}
            >
              <Text color="light-dark" size="sm">
                {ether + " Ether"}
              </Text>
            </Tooltip>
          </div>
        </div>
        <Link color="light-dark" onClick={() => history.push("/cash-out")}>
          Cash out <Icon icon="ArrowRight" />
        </Link>
      </div>
      </Panel>
    );
  }
}

BalancePanel.defaultProps = {
  balance: undefined,
  ether: undefined,
};

BalancePanel.propTypes = {
  balance: React.PropTypes.number,
  ether: React.PropTypes.number
};

const mapStateToProps = state => ({
  balance: AccountSelectors.getTokensBalance(state),
  ether: AccountSelectors.getTokensEther(state),
  wib: AccountSelectors.getTokensWib(state),
});

export default compose(withRouter, connect(mapStateToProps))(BalancePanel);
