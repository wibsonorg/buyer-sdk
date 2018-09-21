import { delay } from "redux-saga";
import { put, takeEvery, all, call } from "redux-saga/effects";
import { setCookie, removeCookie } from "../../../utils/cookies"

import * as Actions from "./actions";

import { loginUser, veriToken } from "./helpers";

export const delays = (ms) => new Promise(res => setTimeout(res, ms))

function* logInUser(action) {
  try {
    yield put(Actions.logInUserPending());

    const authenticated = yield call(loginUser, action.payload);

    yield call(delays, 1000)

    const { token } = authenticated
    setCookie('token', token, {})

    yield put(Actions.logInUserSucceed(authenticated));
  } catch (error) {
    yield put(Actions.logInUserFailed(error));
  }
}

function* verifyToken(action) {
  while (true) {
    yield call(delay, 8000);

    const authenticated = yield call(veriToken);
    const statusCode = authenticated && authenticated.statusCode;
    if (statusCode === 401) {
      removeCookie('token')
      yield put(Actions.verifyTokenFailed(authenticated));
      //window.location.reload();
    };   
  }
}

function* watchLogInUser() {
  yield takeEvery(Actions.logInUser.getType(), logInUser);
}

function* watchVerifyToken() {
  yield takeEvery(Actions.verifyToken.getType(), verifyToken);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchLogInUser(), watchVerifyToken()]);
}
