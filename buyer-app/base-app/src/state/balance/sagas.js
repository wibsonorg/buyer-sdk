import { delay } from "redux-saga";
import { select, put, takeLatest, all, call } from "redux-saga/effects";

import * as Selectors from "./selectors";

import { getTokenBalance } from "./helpers";

import * as Actions from "./actions";

function* updateBalance(action) {
  while (true) {
    yield call(delay, 5000);

    const tokenBalance = yield call(getTokenBalance);

    const lastTokenBalance = yield select(Selectors.getTokensBalance);

    if (tokenBalance !== lastTokenBalance) {
      yield put(Actions.updateTokenBalance(tokenBalance));
    }
  }
}

function* watchStartUpdate() {
  yield takeLatest(Actions.startBalancePolling.getType(), updateBalance);
}

export default function* rootSaga() {
  yield all([watchStartUpdate()]);
}
