import { delay } from "redux-saga";
import { takeLatest, all, call } from "redux-saga/effects";
import { removeCookie } from "../../../utils/cookies"

import * as Actions from "./actions";

import { veriToken } from "./helpers";

function* verifyToken(action) {
  while (true) {
    yield call(delay, 8000);

    const authenticated = yield call(veriToken);

    const { invalid } = authenticated;
    if (invalid) {
      removeCookie('token')
      window.location.reload();
    };   
  }
}

function* watchverifyToken() {
  yield takeLatest(Actions.verifyToken.getType(), verifyToken);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchverifyToken()]);
}
