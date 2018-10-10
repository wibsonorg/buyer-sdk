import { createAction } from "redux-act";

const fetchDataOrdersAddressesAmount = createAction("DATA_ORDER_ADDRESSES_AMOUNT_FETCH");
const fetchDataOrdersAddressesAmountSucceed = createAction(
  "DATA_ORDER_ADDRESSES_AMOUNT_FETCH_SUCCEED"
);
const fetchDataOrdersAddressesAmountFailed = createAction(
  "DATA_ORDER_ADDRESSES_AMOUNT_FETCH_FAILED"
);

export {
  fetchDataOrdersAddressesAmount,
  fetchDataOrdersAddressesAmountSucceed,
  fetchDataOrdersAddressesAmountFailed
};
