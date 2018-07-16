import React, { Component } from "react";

import R from "ramda";

import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Label from "base-app-src/components/Label";
import Button from "base-app-src/components/Button";
import DataTable from "base-app-src/components/DataTable";
import DateDetail from "base-app-src/components/DateDetail";
import AudienceDetail from "base-app-src/components/AudienceDetail";
import NotariesDetail from "base-app-src/components/NotariesDetail";
import RequestedDataDetail from "base-app-src/components/RequestedDataDetail";

import * as OntologySelectors from "base-app-src/state/ontologies/selectors";
import * as NotariesSelectors from "base-app-src/state/notaries/selectors";
import * as CloseDataOrderActions from "state/entities/closeDataOrder/actions";

import "./BoughtDataOrders.css";

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

class OpenDataOrders extends Component {
  renderStatus(order) {
    if (order.notaries > 0) {
      return "Active";
    } else {
      return "Waiting for notary";
    }
  }

  renderActions(order) {
    const { closeDataOrder, dataOrders } = this.props;

    const fullOrder = dataOrders[order.orderAddress];


    const closeDisabled =
      // eslint-disable-next-line eqeqeq
      order.dataCount == 0 ||
      fullOrder.data.transactionCompleted ||
      fullOrder.closePending;

    return (
      <div className="wibson-bought-data-orders-actions">
        <Button
          onClick={() => closeDataOrder(order)}
          disabled={closeDisabled}
          size="sm"
        >
          {fullOrder.closePending ? "Closing" : "Close"}
        </Button>
      </div>
    );
  }

  render() {
    const {
      audienceOntology,
      dataOntology,
      dataOrders,
      availableNotaries
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
              renderer: value => <DateDetail value={value} />
            },
            {
              name: "orderAddress",
              label: "Order",
              width: "250",
              sortable: false,
              renderer: value => <Label color="light-dark">{value}</Label>
            },
            {
              name: "audience",
              label: "Audience",
              width: "402",
              renderer: value => (
                <AudienceDetail
                  audience={value}
                  requestableAudience={audienceOntology}
                />
              )
            },
            {
              name: "notaries",
              label: "Notaries",
              width: "150",
              renderer: value => (
                <NotariesDetail
                  value={value}
                  notariesSchema={availableNotaries.list}
                />
              )
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
              name: "sellers",
              label: "Data bought",
              width: "245",
              renderer: sellers => <Label>{sellers.length || 0}</Label>
            },
            {
              name: "dataCount",
              label: "Data received",
              width: "245",
              renderer: value => <Label>{value || 0}</Label>
            },
            {
              name: "status",
              label: "Status",
              width: "234",
              renderer: (value, order) => this.renderStatus(order)
            },
            {
              name: "actions",
              width: "160",
              renderer: (value, order) => this.renderActions(order)
            }
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dataOntology: OntologySelectors.getDataOntology(state),
  audienceOntology: OntologySelectors.getAudienceOntology(state),
  availableNotaries: NotariesSelectors.getNotaries(state)
});

const mapDispatchToProps = dispatch => ({
  closeDataOrder: dataOrder => {
    dispatch(CloseDataOrderActions.closeDataOrder({ dataOrder }));
  }
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(OpenDataOrders);
