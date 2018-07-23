import R from "ramda";

function getDataOrder(state, orderAddress) {
  return state.dataOrdersByAddress[orderAddress];
}

const isBought = ({ data }) =>
  data.responsesSelected && !data.transactionCompleted;
const pickAvailable = R.pickBy(({ data }) => data);

const isClosed = ({ data }) => data.isClosed;
const isActive = ({ data }) => !data.isClosed;

const hasFailed = ({ error }) => error; // eslint-disable-next-line eqeqeq

function getFailedDataOrders(state) {
  const result = R.pickBy(hasFailed)(state.dataOrdersByAddress);
  return result;
}

function getActiveDataOrders(state) {
  const result = R.compose(R.pickBy(isActive), pickAvailable)(
    state.dataOrdersByAddress
  );
  return result;
}

function getBoughtDataOrders(state) {
  const result = R.compose(R.pickBy(isBought), pickAvailable)(
    state.dataOrdersByAddress
  );
  return result;
}

function getClosedDataOrders(state) {
  const result = R.compose(R.pickBy(isClosed), pickAvailable)(
    state.dataOrdersByAddress
  );
  return result;
}

function isFetching(state) {
  if (!state.dataOrdersAddresses.fulfilled) {
    return true;
  }

  const res =
    state.dataOrdersAddresses.data &&
    R.any(
      addr =>
        !state.dataOrdersByAddress[addr] ||
        state.dataOrdersByAddress[addr].pending
    )(state.dataOrdersAddresses.data);

  return res;
}

export {
  getFailedDataOrders,
  getActiveDataOrders,
  getBoughtDataOrders,
  getDataOrder,
  getClosedDataOrders,
  isFetching
};
