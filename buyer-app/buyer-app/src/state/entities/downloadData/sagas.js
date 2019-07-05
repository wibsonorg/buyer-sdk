import { put, takeLatest, all, call } from "redux-saga/effects";
import download from "downloadjs";

import * as NotificationActions from "state/entities/notifications/actions";
import { getData } from "./helpers";

import * as Actions from "./actions";

/**
 * Download data
 * @yield {[type]} [description]
 */
function* downloadData(action) {
  const { dataOrder } = action.payload;

  try {
    const response = yield call(getData, dataOrder.orderAddress);
    if (response.error) {
      yield put(
        NotificationActions.createNotification({
          message: response.message,
          status: "critical"
        })
      );
    } else {
      yield call(download, response, "data.csv", "text/csv");
      yield put(Actions.downloadDataSucceed());
    }
  } catch (error) {
    console.error(error);
    yield put(
      Actions.downloadDataFailed({
        dataOrder,
        error: error.message
      })
    );
  }
}

function* watchDownloadData() {
  yield takeLatest(Actions.downloadData.getType(), downloadData);
}

export default function* rootSaga() {
  yield all([watchDownloadData()]);
}
