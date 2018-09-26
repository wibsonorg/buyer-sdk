import { delay } from "redux-saga";
import { select, put, takeLatest, all, call } from "redux-saga/effects";
import { getCookie } from "../../../utils/cookies";

import * as Selectors from "./selectors";

import { getAccount } from "./helpers";

import * as Actions from "./actions";

function* updateAccount(action) {
  
  while (getCookie('token')) {
    yield call(delay, 5000);
    
    try {
      const account = yield call(getAccount);
      
      if (account.statusCode === 401) {
        console.log(account.message)
      } else {
        const lastAccount = yield select(Selectors.getAccount);
        if (account.balance !== lastAccount.balance || account.ether !== lastAccount.ether) {
          yield put(Actions.updateAccount(account));
        };
      };
    } catch(error) {
      console.error(error);
    };
  };
};

function* watchStartUpdate() {
  yield takeLatest(Actions.startAccountPolling.getType(), updateAccount);
}

export default function* rootSaga() {
  yield all([watchStartUpdate()]);
}
