import { createAction } from "redux-act";

// TODO: We must do this because of the way base-app is imported that makes
// this file to be imported twice. When we fix that, we can re-enable the check.
import { types } from 'redux-act';
types.disableChecking();


const fetchNotaries = createAction("NOTARIES_FETCH");
const fetchNotariesFailed = createAction("NOTARIES_FETCH_FAILED");
const fetchNotariesSucceed = createAction("NOTARIES_FETCH_SUCCEED");
const fetchNotariesPending = createAction("NOTARIES_FETCH_PENDING");

export {
  fetchNotaries,
  fetchNotariesFailed,
  fetchNotariesSucceed,
  fetchNotariesPending
};
