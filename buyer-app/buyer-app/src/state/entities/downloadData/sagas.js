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
    const { data, error } = yield call(getData, dataOrder.id);
    if (error) {
      yield put(
        NotificationActions.createNotification({
          message: error.message,
          status: "critical"
        })
      );
    } else {
      const fileName = dataOrder.requestedData.join("-") + ".csv";
      yield call(download, data, fileName, "text/csv");
      yield put(Actions.downloadDataSucceed());
    }
  } catch (error) {
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
