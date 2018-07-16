import { createAction } from "redux-act";


const closeDataOrder = createAction("DATA_ORDER_CLOSE");
const closeDataOrderSucceed = createAction("DATA_ORDER_CLOSE_SUCCEED");
const closeDataOrderFailed = createAction("DATA_ORDER_CLOSE_FAILED");

export {
  closeDataOrder,
  closeDataOrderSucceed,
  closeDataOrderFailed
};
