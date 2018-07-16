import { all } from "redux-saga/effects";

import balanceSagas from "./balance/sagas";
import notariesSagas from "./notaries/sagas";
import notificationsSagas from "./notifications/sagas";

export default function* rootSaga() {
  yield all([balanceSagas(), notariesSagas(), notificationsSagas()]);
}
