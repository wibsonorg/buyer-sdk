import React from "react";

import AppHeader from "base-app-src/components/AppHeader";
import Button from "base-app-src/components/Button";
import Select from "base-app-src/components/Select/Select";
import SelectItem from "base-app-src/components/Select/SelectItem";
import LoadingBar from "base-app-src/components/LoadingBar";

import Config from "../../config";

import cn from "classnames/bind";
import styles from "./Buyer.css";
const cx = cn.bind(styles);

import { compose, withProps } from "recompose";
import { connect } from "react-redux";
import { Route, withRouter, Redirect } from "react-router-dom";

import * as DataOrdersByAddress from "state/entities/dataOrdersByAddress/selectors";
import * as DataOrdersAddresses from "state/entities/dataOrdersAddresses/selectors";
import * as Account from "state/entities/account/selectors";

import * as PollingActions from "state/entities/polling/actions";

import * as DataOrdersAddressesActions from "state/entities/dataOrdersAddresses/actions";
import * as authenticationActions from "state/entities/authentication/actions";
import { withNotaries } from "state/entities/notaries/hoc";

import InfoPanel from "./headerPanels/InfoPanel";

import AppNotifications from "../AppNotifications";
import BalancePanel from "./BalancePanel";
import OpenDataOrders from "./OpenDataOrders";
import BoughtDataOrders from "./BoughtDataOrders";
import FailedDataOrders from "./FailedDataOrders";
import DataOrderCreate from "./DataOrderCreate";

import R from "ramda";

class Buyer extends React.Component {
  componentDidMount() {
    this.props.fetchDataOrders();
  }

  handleSelectClick = value => {
    if (this.props.currentRoute !== value) {
      this.props.history.push(`/${value}`);
    }
  };

  handleLogOut = () => {
    this.props.logOutUser();
  };

  renderSelect() {
    return (
      <Select
        value={this.props.currentRoute}
        itemsContainerClassName="page-selector-items-container"
      >
        <SelectItem
          value="open-orders"
          label="Open Data Orders"
          onClick={this.handleSelectClick}
        />
        <SelectItem
          value="closed-orders"
          label="Closed Data Orders"
          onClick={this.handleSelectClick}
        />
      </Select>
    );
  }

  isLoading() {
    const { isFetching } = this.props;
    return isFetching;
  }

  render() {
    const {
      history,
      activeDataOrders,
      boughtDataOrders,
      closedDataOrders,
      failedDataOrders,
      account
    } = this.props;

    const availableDataResponsesCount = R.compose(
      R.sum,
      R.map(R.pathOr(0, ['data', 'offChain', 'dataResponsesCount'])),
      R.values
    )(activeDataOrders);

    const panels = [
      <BalancePanel
        key={1}
        tokenDollarRate={Config.get("simpleToken.conversion.usd")}
      />,
      <InfoPanel
        key={2}
        title="Available datasets"
        data={R.values(boughtDataOrders).length}
      />,
      <InfoPanel
        key={4}
        title="Active Data Responses"
        data={availableDataResponsesCount}
        units="Responses"
      />
    ];

    return (
      <div>
        <AppHeader userRole="buyer" account={account.address} panels={panels} logOut={this.handleLogOut} />
        <LoadingBar loading={this.isLoading()} />
        <AppNotifications />
        <div className={cx("page-content")}>
          <div className={cx("page-navbar")}>
            <div className={cx("page-selector")}>
              <span>View</span>
              {this.renderSelect()}
            </div>
            <div className={cx("action-buttons")}>
              <Button
                onClick={() => {
                  this.props.fetchDataOrders(this.state);
                }}
              >
                Refresh
              </Button>
              <Button
                onClick={() => {
                  history.push("/open-orders/new-data-order");
                }}
              >
                Place an order
              </Button>
            </div>
          </div>
          <Route exact path="/" render={() => <Redirect to="/open-orders" />} />
          <Route
            path="/open-orders"
            render={() => (
              <div>
                <OpenDataOrders dataOrders={activeDataOrders} />
                <Route
                  path="/open-orders/new-data-order"
                  render={DataOrderCreate}
                />
              </div>
            )}
          />
          <Route
            path="/failed-orders"
            render={() => <FailedDataOrders dataOrders={failedDataOrders} />}
          />
          <Route
            path="/data-responses"
            render={() => <BoughtDataOrders dataOrders={boughtDataOrders} />}
          />
          <Route
            path="/closed-orders"
            render={() => <BoughtDataOrders dataOrders={closedDataOrders} />}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  failedDataOrders: DataOrdersByAddress.getFailedDataOrders(state),
  activeDataOrders: DataOrdersByAddress.getActiveDataOrders(state),
  boughtDataOrders: DataOrdersByAddress.getBoughtDataOrders(state),
  closedDataOrders: DataOrdersByAddress.getClosedDataOrders(state),
  dataOrdersAddress: DataOrdersAddresses.getDataOrdersAddresses(state),
  isFetching: DataOrdersByAddress.isFetching(state),
  account: Account.getAccount(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  startPollingDataOrders: () => {
    dispatch(PollingActions.startPollingDataOrders());
  },
  fetchDataOrders: (params) => {
    dispatch(
      DataOrdersAddressesActions.fetchDataOrdersAddresses()
    );
  },
  logOutUser: () => {
    dispatch(authenticationActions.logOut());
  },
});

export default compose(
  withRouter,
  withNotaries,
  withProps(props => ({
    currentRoute: props.location.pathname.split("/")[1]
  })),
  connect(mapStateToProps, mapDispatchToProps)
)(Buyer);
