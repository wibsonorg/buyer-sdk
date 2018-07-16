import { createAction } from "redux-act";

const startPollingDataOrders = createAction("DATA_ORDERS_START_POLLING");

export {
  startPollingDataOrders
};
