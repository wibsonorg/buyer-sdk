import { createAction } from "redux-act";

const fetchDataOrdersAddresses = createAction("DATA_ORDER_ADDRESSES_FETCH");
const fetchDataOrdersAddressesSucceed = createAction(
  "DATA_ORDER_ADDRESSES_FETCH_SUCCEED"
);
const fetchDataOrdersAddressesFailed = createAction(
  "DATA_ORDER_ADDRESSES_FETCH_FAILED"
);

export {
  fetchDataOrdersAddresses,
  fetchDataOrdersAddressesSucceed,
  fetchDataOrdersAddressesFailed
};
