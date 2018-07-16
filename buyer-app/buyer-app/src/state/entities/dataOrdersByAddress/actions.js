import { createAction } from "redux-act";

const fetchDataOrderData = createAction("DATA_ORDER_DATA_FETCH");
const fetchDataOrderDataSucceed = createAction(
  "DATA_ORDER_DATA_FETCH_SUCCEED"
);
const fetchDataOrderDataFailed = createAction(
  "DATA_ORDER_DATA_FETCH_FAILED"
);

export {
  fetchDataOrderData,
  fetchDataOrderDataSucceed,
  fetchDataOrderDataFailed
};
