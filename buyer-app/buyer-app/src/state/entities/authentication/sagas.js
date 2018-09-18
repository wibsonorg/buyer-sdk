import { put, takeEvery, all, call } from "redux-saga/effects";

import * as Actions from "./actions";

import { fetchAuth } from "./helpers";

function* fethAuthentication(action) {
  try {
    yield put(Actions.fetchAuthenticationPending());

    const authenticated = yield call(fetchAuth, action.payload);

    yield put(Actions.fetchAuthenticationSucceed(authenticated));
  } catch (error) {
    yield put(Actions.fetchAuthenticationFailed(error));
  }
}

function* watchFetchAuthentication() {
  yield takeEvery(Actions.fethAuthentication.getType(), fethAuthentication);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchFetchAuthentication()]);
}
