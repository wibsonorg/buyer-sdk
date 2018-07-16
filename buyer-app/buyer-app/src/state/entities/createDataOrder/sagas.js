import { put, takeLatest, all, call } from "redux-saga/effects";

import * as Actions from "./actions";

import * as NotificationsActions from "state/entities/notifications/actions";

import * as DataOrdersHelpers from "lib/protocol-helpers/data-orders";
import formatDate from 'date-fns/format'

function* createDataOrderSaga(action) {
  const {
    requestedAudience,
    requestedData,
    notarizeData,
    requestedNotaries,
    publicURL,
    conditions,
    maxPrice,
    buyerId
  } = action.payload;

  try {
    const { orderAddress } = yield call(
      DataOrdersHelpers.createBuyerDataOrder,
      requestedAudience,
      requestedData,
      notarizeData,
      requestedNotaries.map(n => n.toLowerCase()),
      publicURL,
      conditions,
      maxPrice,
      buyerId
    );

    yield put(
      Actions.createDataOrderSucceed({
        dataOrder: {
          orderAddress,
          requestedAudience,
          requestedData: [requestedData], // It is an array of requested data, even if right now we only use one.
          notarizeData,
          requestedNotaries,
          acceptedNotaries: [],
          conditions,
          publicURL,
          createdAt: formatDate(Date.now()),
          transactionCompleted: false,
          maxPrice,
          offChain: {},
          buyerId
        }
      })
    );

    yield put(
      NotificationsActions.createNotification({
        message:
          "Your order has been created. The Notary is going to be notified.",
        status: "ok"
      })
    );
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
