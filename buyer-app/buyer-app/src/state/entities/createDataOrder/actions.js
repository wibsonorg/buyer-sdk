import { createAction } from "redux-act";

const createDataOrderClear = createAction("DATA_ORDER_CREATE_CLEAR");
const createDataOrder = createAction("DATA_ORDER_CREATE");
const createDataOrderFailed = createAction("DATA_ORDER_CREATE_FAILED");
const createDataOrderSucceed = createAction("DATA_ORDER_CREATE_SUCCEED");

export {
  createDataOrderClear,
  createDataOrder,
  createDataOrderFailed,
  createDataOrderSucceed
};
