import { all } from "redux-saga/effects";

import createDataOrderSagas from "state/entities/createDataOrder/sagas";
import buyDataOrderSagas from "state/entities/buyDataOrder/sagas";
import closeDataOrderSagas from "state/entities/closeDataOrder/sagas";
import dataOrdersAddressesSagas from "state/entities/dataOrdersAddresses/sagas";
import dataOrdersAddressesAmountSagas from "state/entities/dataOrdersAddressesAmount/sagas";
import notariesSagas from "state/entities/notaries/sagas";
import accountSagas from "state/entities/account/sagas";
import notificationsSagas from "state/entities/notifications/sagas";
import authenticationSagas from "state/entities/authentication/sagas";

import pollingSagas from "./polling";

export default function* rootSaga() {
  yield all([
    authenticationSagas(),
    dataOrdersAddressesSagas(),
    pollingSagas(),
    createDataOrderSagas(),
    buyDataOrderSagas(),
    dataOrdersAddressesAmountSagas(),
    closeDataOrderSagas(),
    notariesSagas(),
    accountSagas(),
    notificationsSagas()
  ])
}
