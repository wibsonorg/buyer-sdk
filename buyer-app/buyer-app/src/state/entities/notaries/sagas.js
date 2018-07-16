import { put, takeLatest, all, call } from "redux-saga/effects";

import * as Actions from "./actions";

import { getNotariesFromContract } from "./helpers";

function* fetchNotaries(action) {
  try {
    yield put(Actions.fetchNotariesPending());

    const notaries = yield call(getNotariesFromContract);

    yield put(Actions.fetchNotariesSucceed(notaries));
  } catch (error) {
    yield put(Actions.fetchNotariesFailed(error));
  }
}

function* watchFetchNotaries() {
  yield takeLatest(Actions.fetchNotaries.getType(), fetchNotaries);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchFetchNotaries()]);
}
