import { put, takeEvery, all, call } from "redux-saga/effects";
import { removeCookie } from "../../../utils/cookies"

import * as Actions from "./actions";

import { veriToken } from "./helpers";

function* verifyToken(action) {
  try {
    const authenticated = yield call(veriToken);
    const { valid } = authenticated;
    if (!valid) {
      removeCookie('token')
    }
  } catch (error) {
    yield put(Actions.verifyTokenFailed(error));
  }
}

function* watchverifyToken() {
  yield takeEvery(Actions.verifyToken.getType(), verifyToken);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchverifyToken()]);
}
