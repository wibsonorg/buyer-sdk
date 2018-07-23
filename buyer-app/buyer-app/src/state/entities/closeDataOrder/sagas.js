import { put, takeLatest, all, call } from "redux-saga/effects";

import * as NotificationActions from "state/entities/notifications/actions";
import * as DataOrdersHelpers from "lib/protocol-helpers/data-orders";

import * as Actions from "./actions";

/**
 * Closes data order in the contract. Everyone get paid.
 * @yield {[type]} [description]
 */
function* closeDataOrder(action) {
  const { dataOrder } = action.payload;

  try {
    yield call(DataOrdersHelpers.closeOrder, dataOrder.orderAddress);

    yield put(Actions.closeDataOrderSucceed({ dataOrder }));

    yield put(
      NotificationActions.createNotification({
        message:
          "The data order is closed. Data sellers will receive theis payment.",
        status: "ok"
      })
    );
  } catch (error) {
    console.log(error);
    yield put(
      Actions.closeDataOrderFailed({
        dataOrder,
        error
      })
    );
    // TODO: rollback transaction somehow if local storage failed.
  }
}

function* watchCloseDataOrder() {
  yield takeLatest(Actions.closeDataOrder.getType(), closeDataOrder);
}

export default function* rootSaga() {
  yield all([watchCloseDataOrder()]);
}
