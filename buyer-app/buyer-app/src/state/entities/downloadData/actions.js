import { createAction } from "redux-act";

const downloadData = createAction("DOWNLOAD_DATA");
const downloadDataSucceed = createAction("DOWNLOAD_DATA_SUCCEED");
const downloadDataFailed = createAction("DOWNLOAD_DATA_FAILED");

export { downloadData, downloadDataSucceed, downloadDataFailed };
