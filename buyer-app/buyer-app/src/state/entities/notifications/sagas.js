import { delay } from "redux-saga";
import { put, takeLatest, all, call } from "redux-saga/effects";

import * as Actions from "./actions";

function* disposeNotificationTimeout(action) {

  yield call(delay, 10000);
  yield put(Actions.popOutNotification());
}

function* watchNotificationCreated() {
  yield takeLatest(Actions.createNotification.getType(), disposeNotificationTimeout);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watchNotificationCreated()]);
}
