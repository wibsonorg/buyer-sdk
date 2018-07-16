import { createAction } from "redux-act";

const startBalancePolling = createAction("AUTOMATIC_BALANCE_UPDATE_START");
const updateTokenBalance = createAction("UPDATE_TOKEN_BALANCE");

export { startBalancePolling, updateTokenBalance };
