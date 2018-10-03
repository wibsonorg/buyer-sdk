import { delay } from "redux-saga";

import {
  takeLatest,
  all,
  call,
} from "redux-saga/effects";

// import * as DataOrdersAddressesActions from "state/entities/dataOrdersAddresses/actions";
import * as DataOrdersAddressesSagas from "state/entities/dataOrdersAddresses/sagas";

import * as PollingActions from "state/entities/polling/actions";

/**
 *
 * Polls buyer data orders from blockchain.
 * Only polls the addresses. When a new address arrives it should populated by the corresponding saga.
 *
 * @param {[type]}
 * @yield {[type]} [description]
 */
function* pollBuyerDataOrders(action) {
  while (true) {
    yield call(DataOrdersAddressesSagas.fetchDataOrdersAddresses);
    yield call(delay, 50000);
  }
}

function* watchStartPollingDataOrders() {
  // WARN: a new action will cancel the last one.
  yield takeLatest(
    PollingActions.startPollingDataOrders.getType(),
    pollBuyerDataOrders
  );
}

export default function* rootSaga() {
  yield all([watchStartPollingDataOrders()]);
}
