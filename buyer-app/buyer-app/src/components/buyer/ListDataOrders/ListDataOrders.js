import React, { Component } from "react";
import PropTypes from "prop-types";

import R from "ramda";

import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Button from "base-app-src/components/Button";
import Label from "base-app-src/components/Label";
import DataTable from "base-app-src/components/DataTable";
import DateDetail from "base-app-src/components/DateDetail";
import RequestedDataDetail from "base-app-src/components/RequestedDataDetail";

import * as OntologySelectors from "base-app-src/state/ontologies/selectors";
import * as NotariesSelectors from "state/entities/notaries/selectors";
import * as CloseDataOrderActions from "state/entities/closeDataOrder/actions";
import * as DownloadDataActions from "state/entities/downloadData/actions";

import "./ListDataOrders.css";

import compareDesc from "date-fns/compare_desc";

/**
 * Returns data orders as needed for the table.
 * It ignores pending and error data orders for now.
 */
const flattenDataOrders = R.compose(
  R.map(({ offChain, ...onChain }) => ({ ...onChain, ...offChain })),
  R.pluck("data"),
  R.filter(R.prop("data")),
  R.values
);

class ListDataOrders extends Component {
  renderActions(order) {
    const { closeDataOrder, dataOrders, downloadData } = this.props;

    const fullOrder = dataOrders[order.orderAddress];

    const closeDisabled =
      fullOrder.data.status === "closed" || fullOrder.data.status === "closing";
    const downloadDisabled = fullOrder.data.sellersProcessed === 0;

    return (
      <div className="wibson-bought-data-orders-actions">
        <Button
          onClick={() => closeDataOrder(order)}
          disabled={closeDisabled}
          size="sm">
          {fullOrder.closePending ? "Closing" : "Close"}
        </Button>
        <Button
          onClick={() => downloadData(order)}
          disabled={downloadDisabled}
          size="sm">
          Download Data
        </Button>
      </div>
    );
  }

  render() {
    const {
      dataOntology,
      dataOrders,
      location: { pathname }
    } = this.props;

    const flatDataOrdersList = flattenDataOrders(dataOrders);

    return (
      <div>
        <DataTable
          data={flatDataOrdersList}
          defaultSortBy="createdAt"
          defaultSortDirection={-1}
          columns={[
            {
              name: "createdAt",
              label: "Date",
              width: "250",
              sortable: true,
              sortFunction: compareDesc,
              renderer: value => <DateDetail value={value * 1000} />
            },
            {
              name: "orderAddress",
              label: "Order",
              width: "250",
              sortable: false,
              renderer: value => <Label color="light-dark">{value}</Label>
            },
            {
              name: "requestedData",
              label: "Requested Data",
              width: "234",
              renderer: value => (
                <RequestedDataDetail
                  requestedData={value}
                  requestableData={dataOntology}
                />
              )
            },
            {
              name: "buyerName",
              label: "Buyer Name",
              width: "250",
              sortable: false,
              renderer: value => <Label color="light-dark">{value}</Label>
            },
            {
              name: "price",
              label: "Price",
              width: "150",
              renderer: value => <Label>{value || 0}</Label>
            },
            {
              name: "sellersProcessed",
              label: "Sellers Processed",
              width: "245",
              renderer: value => <Label>{value || 0}</Label>
            },
            {
              name: "wibSpent",
              label: "WIB Spent",
              width: "245",
              renderer: value => <Label>{value || 0}</Label>
            },
            {
              name: "ethSpent",
              label: "ETH Spent",
              width: "245",
              renderer: value => <Label>{value || 0}</Label>
            },
            {
              name: "paymentsRegistered",
              label: "Payments",
              width: "245",
              renderer: value => <Label>{value || 0}</Label>
            },
            {
              name: "status",
              label: "Status",
              width: "234",
              renderer: value => (
                <Label color="light-dark">
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Label>
              )
            },
            pathname === "/open-orders" && {
              name: "actions",
              label: "Actions",
              width: "160",
              renderer: (value, order) => this.renderActions(order)
            }
          ]}
        />
      </div>
    );
  }
}

ListDataOrders.propTypes = {
  dataOrders: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  dataOntology: OntologySelectors.getDataOntology(state),
  audienceOntology: OntologySelectors.getAudienceOntology(state),
  availableNotaries: NotariesSelectors.getNotaries(state)
});

const mapDispatchToProps = dispatch => ({
  closeDataOrder: dataOrder => {
    dispatch(CloseDataOrderActions.closeDataOrder({ dataOrder }));
  },
  downloadData: dataOrder => {
    dispatch(DownloadDataActions.downloadData({ dataOrder }));
  }
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ListDataOrders);
