import { put, takeLatest, all } from "redux-saga/effects";

import * as Actions from "./actions";

function* buyDataResponses(action) {
  const { orderAddress } = action.payload;

  try {
    // yield call(buyResponses, orderAddress, unitPrice, responsesToBuy);
  } catch (error) {
    console.log(error);
    yield put(Actions.buyDataResponsesFailed({ orderAddress, error }));
  }

  yield put(Actions.buyDataResponsesSucceed({ orderAddress }));
}

function* watchBuyDataResponses() {
  yield takeLatest(Actions.buyDataResponses.getType(), buyDataResponses);
}

export default function* rootSaga() {
  yield all([watchBuyDataResponses()]);
}
