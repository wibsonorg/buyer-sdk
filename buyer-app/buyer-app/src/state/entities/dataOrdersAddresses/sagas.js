import { throttle, put, all, call } from "redux-saga/effects";

import * as DataOrdersHelpers from "lib/protocol-helpers/data-orders";
import * as DataOrdersAddressesActions from "state/entities/dataOrdersAddresses/actions";
import * as DataOrdersByAddressActions from "state/entities/dataOrdersByAddress/actions";

import R from "ramda";

// TODO: This names are old. Now the api returns the full data orders, not just the addresses.
export function* fetchDataOrdersAddresses(action) {
  try {
    const fullDataOrders = yield call(DataOrdersHelpers.listBuyerDataOrders);

    yield put(
      DataOrdersAddressesActions.fetchDataOrdersAddressesSucceed({
        data: R.pluck("id", fullDataOrders.orders)
      })
    );
    // We store the whole data orders
    // TODO: send just one action. I don't do it right now in order to avoid changing too much code.
    for (let fullDataOrder of fullDataOrders.orders) {
      yield put(
        DataOrdersByAddressActions.fetchDataOrderDataSucceed({
          orderAddress: fullDataOrder.id,
          data: {orderAddress: fullDataOrder.id, ...fullDataOrder}
        })
      );
    }

  } catch (error) {
    yield put(DataOrdersAddressesActions.fetchDataOrdersAddressesFailed({ error }));
  }
}

function* watchFetchDataOrdersAddresses() {
  yield throttle(
    5000,
    DataOrdersAddressesActions.fetchDataOrdersAddresses.getType(),
    fetchDataOrdersAddresses
  );
}

export default function* rootSaga() {
  yield all([watchFetchDataOrdersAddresses()]);
}
