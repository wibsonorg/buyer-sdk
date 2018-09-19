import { put, takeEvery, all, call } from "redux-saga/effects";
import {setCookie} from "../../../utils/cookies"

import * as Actions from "./actions";

import { loginUser } from "./helpers";

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

function* watchlogInUser() {
  yield takeEvery(Actions.logInUser.getType(), logInUser);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchlogInUser()]);
}
