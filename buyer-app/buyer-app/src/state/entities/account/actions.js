import { createAction } from "redux-act";

const startAccountPolling = createAction("AUTOMATIC_ACCOUNT_UPDATE_START");
const updateAccount = createAction("UPDATE_ACCOUNT");

export { startAccountPolling, updateAccount };
