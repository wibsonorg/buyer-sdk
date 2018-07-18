import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import createDataOrder from "state/entities/createDataOrder/reducers";
import dataExchange from "state/entities/dataExchange/reducers";
import dataOrdersAddresses from "state/entities/dataOrdersAddresses/reducers";
import dataOrdersByAddress from "state/entities/dataOrdersByAddress/reducers";
import buyDataOrder from "state/entities/buyDataOrder/reducers";
import notaries from "state/entities/notaries/reducers";
import account from "state/entities/account/reducers";
import notifications from "state/entities/notifications/reducers";

const reducers = {
  routing: routerReducer,
  dataExchange,
  dataOrdersAddresses,
  dataOrdersByAddress,
  buyDataOrder, // Should be called buyDataResponses
  notaries,
  account,
  notifications,
  createDataOrder
};

export default combineReducers(reducers);
