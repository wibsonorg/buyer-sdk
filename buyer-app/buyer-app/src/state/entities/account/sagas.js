import { delay } from "redux-saga";
import { select, put, takeLatest, all, call } from "redux-saga/effects";

import * as Selectors from "./selectors";
import * as AuthenticationSelectors from "../authentication/selectors";
import * as AuthenticationActions from "../authentication/actions";

import { getAccount } from "./helpers";

import * as Actions from "./actions";

function* updateAccount(action) {
  let loggedIn = true;
  while (loggedIn) {
    yield call(delay, 5000);

    try {
      const account = yield call(getAccount);

      if (account.statusCode === 401) {
        yield put(AuthenticationActions.logOut());
      } else {
        const lastAccount = yield select(Selectors.getAccount);
        if (account.balance !== lastAccount.balance || account.ether !== lastAccount.ether) {
          yield put(Actions.updateAccount(account));
        };
      };
    } catch(error) {
      console.error(error);
    };
    const auth = yield select(AuthenticationSelectors.getAuthentication);
    loggedIn = auth.authenticated;
  };
};

function* watchStartUpdate() {
  yield takeLatest(Actions.startAccountPolling.getType(), updateAccount);
}

export default function* rootSaga() {
  yield all([watchStartUpdate()]);
}
