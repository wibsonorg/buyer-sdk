import { createAction } from "redux-act";

// TODO: We must do this because of the way base-app is imported that makes
// this file to be imported twice. When we fix that, we can re-enable the check.
import { types } from 'redux-act';
types.disableChecking();

const fethAuthentication = createAction("AUTHENTICATION_FETCH");
const fetchAuthenticationFailed = createAction("AUTHENTICATION_FETCH_FAILED");
const fetchAuthenticationSucceed = createAction("AUTHENTICATION_FETCH_SUCCEED");
const fetchAuthenticationPending = createAction("AUTHENTICATION_FETCH_PENDING");

export { 
	fethAuthentication, 
	fetchAuthenticationFailed, 
	fetchAuthenticationSucceed, 
	fetchAuthenticationPending
};
