import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import createDataOrder from "state/entities/createDataOrder/reducers";
// import data from 'state/entities/data/reducers';
// import buyerDataOrders from 'state/entities/buyerDataOrders/reducers';
// import downloadData from 'state/entities/downloadData/reducers';

import dataOrdersAddresses from "state/entities/dataOrdersAddresses/reducers";
import dataOrdersByAddress from "state/entities/dataOrdersByAddress/reducers";
import buyDataOrder from "state/entities/buyDataOrder/reducers";

import baseReducers from "base-app-src/state/reducers";

const reducers = {
  routing: routerReducer,
  base: baseReducers,
  dataOrdersAddresses,
  dataOrdersByAddress,
  buyDataOrder, // Should be called buyDataResponses
  createDataOrder
  // data,
  // buyerDataOrders,
  // downloadData,
};

export default combineReducers(reducers);
