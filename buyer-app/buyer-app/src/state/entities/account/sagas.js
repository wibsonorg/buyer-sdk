import { delay } from "redux-saga";
import { select, put, takeLatest, all, call } from "redux-saga/effects";

import * as AuthenticationSelectors from "../authentication/selectors";
import * as AuthenticationActions from "../authentication/actions";

import { getAccount } from "./helpers";

import * as Actions from "./actions";

function* updateAccount() {
  let loggedIn = true;
  while (loggedIn) {
    try {
      const account = yield call(getAccount);
      if (account.status === 401) {
        yield put(AuthenticationActions.logOut());
      }
      if (account.status === 500) {
        throw new Error("Connection Error");
      } else {
        yield put(Actions.updateAccount(account));
      }
    } catch (error) {
      console.error(error);
    }
    const auth = yield select(AuthenticationSelectors.getAuthentication);
    loggedIn = auth.authenticated;
    yield call(delay, 60000);
  }
}

function* watchStartUpdate() {
  yield takeLatest(Actions.startAccountPolling.getType(), updateAccount);
}

export default function* rootSaga() {
  yield all([watchStartUpdate()]);
}
