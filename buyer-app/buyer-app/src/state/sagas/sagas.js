import { all } from "redux-saga/effects";

import baseSagas from "base-app-src/state/sagas";
import createDataOrderSagas from "state/entities/createDataOrder/sagas";
import buyDataOrderSagas from "state/entities/buyDataOrder/sagas";
import closeDataOrderSagas from "state/entities/closeDataOrder/sagas";
import dataOrdersAddressesSagas from "state/entities/dataOrdersAddresses/sagas";


import pollingSagas from "./polling";

export default function* rootSaga() {
  yield all([
    baseSagas(),
    dataOrdersAddressesSagas(),
    pollingSagas(),
    createDataOrderSagas(),
    buyDataOrderSagas(),
    closeDataOrderSagas()
  ]);
}
