import React, { Component } from "react";
import PropTypes from "prop-types";

import R from "ramda";

import DataTable from "base-app-src/components/DataTable";


class FailedDataOrders extends Component {

  render() {
    const {
      dataOrders
    } = this.props;

    const flatDataOrdersList = R.keys(dataOrders);
    return (
      <div>
        <DataTable
          data={flatDataOrdersList}
          defaultSortBy="createdAt"
          defaultSortDirection={-1}
          columns={[
            {
              name: "address",
              label: "Address",
              width: "250",
              renderer: (_, row) => row
            }
          ]}
        />
      </div>
    );
  }
}

FailedDataOrders.propTypes = {
  dataOrders: PropTypes.object.isRequired
};

export default FailedDataOrders;
