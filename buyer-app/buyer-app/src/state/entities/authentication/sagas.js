import { delay } from "redux-saga";
import { put, takeEvery, all, call, fork } from "redux-saga/effects";
import { setCookie, removeCookie, getCookie } from "../../../utils/cookies"

import * as Actions from "./actions";

import { logInUser, verifyToken } from "./helpers";

function* logInUserWorker(action) {

  yield put(Actions.logInUserPending());
  
  try {
    const authenticated = yield call(logInUser, action.payload);

    yield call(delay, 800)

    const statusCode = authenticated && authenticated.statusCode

    if (statusCode === 401) {
      yield put(Actions.logInUserFailed(authenticated.message));
    } else {
      const { token } = authenticated
      setCookie('token', token, {})
      yield put(Actions.logInUserSucceed(authenticated));
    }

  } catch (error) {
    console.error(error)
    let err = 'Connection refused';
    yield put(Actions.logInUserFailed(err));
  }
}

export function * logOutUserWorker(action) {
  removeCookie('token')
  yield put(Actions.logOutUser())
}

function* verifyTokenWorker(action) {
  while (true) {
    yield call(delay, 1000 * 60 * 60);

    const authenticated = yield call(verifyToken);
    const statusCode = authenticated && authenticated.statusCode;
    if (statusCode === 401) {
      removeCookie('token')
      yield put(Actions.logOutUser());
    };   
  }
}

function* verifyCookieWorker(action) {
  while (true) {
    yield call(delay, 5000);
    if (getCookie('token') === undefined){
      yield put(Actions.logOutUser());
    };
  }
};

function* watchLogInUser() {
  yield takeEvery(Actions.logInUser.getType(), logInUserWorker);
}

function* watchVerifyToken() {
  yield takeEvery(Actions.verifyToken.getType(), verifyTokenWorker);
}

function* watchlogOutUser() {
  yield takeEvery(Actions.logOutUser.getType(), logOutUserWorker);
}

function* watchVerifyCookie() {
  yield takeEvery(Actions.verifyCookie.getType(), verifyCookieWorker);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchLogInUser(), watchVerifyToken(), watchVerifyCookie()]);
  yield [fork(watchlogOutUser)]
}
