import { delay } from 'redux-saga';
import { put, takeEvery, all, call } from 'redux-saga/effects';
import { setCookie, removeCookie } from '../../../utils/cookies';

import * as Actions from './actions';

import { logInUser, verifyToken } from './helpers';

function* logInUserWorker(action) {
  yield put(Actions.logInUserPending());

  try {
    const authenticated = yield call(logInUser, action.payload);
    const statusCode = authenticated && authenticated.statusCode;

    if (statusCode >= 300) {
      yield put(Actions.logInUserFailed(authenticated.message));
    } else {
      const { token } = authenticated;
      setCookie('token', token, {});
      yield put(Actions.logInUserSucceed(authenticated));
    }
  } catch (err) {
    console.error(err);
    const error = "connection refused"
    yield put(Actions.logInUserFailed(error));
  }
}

export function* logOutUserWorker(action) {
  removeCookie('token');
  yield put(Actions.logOutUser());
}

function* verifyTokenWorker(action) {
  let validToken = true;
  while (validToken) {
    yield call(delay, 1000 * 60 * 60);

    const authenticated = yield call(verifyToken);
    const { statusCode } = authenticated;
    if (statusCode === 401) {
      yield put(Actions.logOut());
      validToken = false;
    }
  }
}

function* watchLogInUser() {
  yield takeEvery(Actions.logInUser.getType(), logInUserWorker);
}

function* watchVerifyToken() {
  yield takeEvery(Actions.verifyToken.getType(), verifyTokenWorker);
}

function* watchlogOutUser() {
  yield takeEvery(Actions.logOut.getType(), logOutUserWorker);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchLogInUser(), watchVerifyToken(), watchlogOutUser()]);
}
