import { put, takeLatest, all, call, select } from "redux-saga/effects";

import * as Actions from "./actions";

import * as NotificationsActions from "state/entities/notifications/actions";
import * as DataExchangeSelectors from "state/entities/dataExchange/selectors";

import * as DataOrdersHelpers from "lib/protocol-helpers/data-orders";
import formatDate from 'date-fns/format'

function* createDataOrderSaga(action) {
  const {
    audience,
    requestedData,
    notaries,
    publicURL,
    conditions,
    price,
    buyerId
  } = action.payload;

  // we take the minimum of the market as the initial budget for the order
  const initialBudgetForAudits = yield select(DataExchangeSelectors.getMinimumInitialBudgetForAudits);

  try {
    const { orderAddress } = yield call(
      DataOrdersHelpers.createBuyerDataOrder,
      audience,
      requestedData,
      publicURL,
      conditions,
      price,
      initialBudgetForAudits
    );

    yield call(
      DataOrdersHelpers.associateBuyerInfoToOrder,
      orderAddress,
      buyerId
    );

    yield call(
      DataOrdersHelpers.addNotariesToOrder,
      orderAddress,
      notaries.map(n => n.toLowerCase())
    );

    yield put(
      Actions.createDataOrderSucceed({
        dataOrder: {
          orderAddress,
          audience,
          requestedData: [requestedData], // It is an array of requested data, even if right now we only use one.
          notaries,
          conditions,
          publicURL,
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
