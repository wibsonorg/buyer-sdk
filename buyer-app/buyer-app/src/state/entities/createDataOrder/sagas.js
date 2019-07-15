import { put, takeLatest, all, call } from "redux-saga/effects";

import * as Actions from "./actions";

import * as DataOrdersAddressesActions from "state/entities/dataOrdersAddresses/actions";
import * as NotificationsActions from "state/entities/notifications/actions";

import * as DataOrdersHelpers from "lib/protocol-helpers/data-orders";
import formatDate from "date-fns/format";

function* createDataOrderSaga(action) {
  const {
    audience,
    requestedData,
    notaries,
    price,
    buyerId
  } = action.payload;

  try {
    const { orderAddress } = yield call(
      DataOrdersHelpers.createBuyerDataOrder,
      audience,
      requestedData,
      price,
      notaries,
      buyerId
    );

    yield put(
      Actions.createDataOrderSucceed({
        dataOrder: {
          orderAddress,
          audience,
          requestedData,
          notaries,
          createdAt: formatDate(Date.now()),
          transactionCompleted: false,
          price,
          offChain: {},
          buyerId
        }
      })
    );

    yield put(
      NotificationsActions.createNotification({
        message: "Order is being created",
        status: "ok"
      })
    );

    yield put(DataOrdersAddressesActions.fetchDataOrdersAddresses());
  } catch (error) {
    yield put(Actions.createDataOrderFailed(error));
    // TODO: rollback transaction somehow if local storage failed.
  }
}

function* watchCreateDataOrder() {
  yield takeLatest(Actions.createDataOrder.getType(), createDataOrderSaga);
}

export default function* rootSaga() {
  yield all([watchCreateDataOrder()]);
}
