import { throttle, put, all, call } from "redux-saga/effects";

import * as DataOrdersHelpers from "lib/protocol-helpers/data-orders";
import * as DataOrdersAddressesAmountActions from "state/entities/dataOrdersAddressesAmount/actions";

export function* fetchDataOrdersAddressesAmount() {
  try {
    const dataOrdersAmount = yield call(DataOrdersHelpers.getBuyerDataOrdersAmount);
    // console.log(dataOrdersAmount);

    yield put(
      DataOrdersAddressesAmountActions.fetchDataOrdersAddressesAmountSucceed({
        data: dataOrdersAmount
      })
    );
  } catch (error) {
    yield put(DataOrdersAddressesAmountActions.fetchDataOrdersAddressesAmountFailed({ error }));
  }
}

function* watchFetchDataOrdersAddressesAmount() {
  yield throttle(
    5000,
    DataOrdersAddressesAmountActions.fetchDataOrdersAddressesAmount.getType(),
    fetchDataOrdersAddressesAmount
  );
}

export default function* rootSaga() {
  yield all([watchFetchDataOrdersAddressesAmount()]);
}
