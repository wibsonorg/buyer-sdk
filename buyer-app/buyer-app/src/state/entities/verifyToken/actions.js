import { createAction } from "redux-act";

// TODO: We must do this because of the way base-app is imported that makes
// this file to be imported twice. When we fix that, we can re-enable the check.
import { types } from 'redux-act';
types.disableChecking();

const verifyToken = createAction("VERIFICATION");
const verifyTokenFailed = createAction("VERIFICATION_FAILED");

export { verifyToken, verifyTokenFailed };
