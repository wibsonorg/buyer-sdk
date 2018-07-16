import { delay } from "redux-saga";
import { select, put, takeLatest, all, call } from "redux-saga/effects";

import * as Selectors from "./selectors";

import { getAccount } from "./helpers";

import * as Actions from "./actions";

function* updateAccount(action) {
  while (true) {
    yield call(delay, 5000);

    const account = yield call(getAccount);

    const lastAccount = yield select(Selectors.getAccount);

    if (account.balance !== lastAccount.balance || account.ether !== lastAccount.ether) {
      yield put(Actions.updateAccount(account));
    }
  }
}

function* watchStartUpdate() {
  yield takeLatest(Actions.startAccountPolling.getType(), updateAccount);
}

export default function* rootSaga() {
  yield all([watchStartUpdate()]);
}
