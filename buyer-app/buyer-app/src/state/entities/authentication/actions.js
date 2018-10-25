import { createAction } from "redux-act";

// TODO: We must do this because of the way base-app is imported that makes
// this file to be imported twice. When we fix that, we can re-enable the check.
import { types } from 'redux-act';
types.disableChecking();

const logInUser = createAction("LOGIN_USER");
const logInUserFailed = createAction("LOGIN_USER_FAILED");
const logInUserSucceed = createAction("LOGIN_USER_SUCCEED");
const logInUserPending = createAction("LOGIN_USER_PENDING");
const verifyToken = createAction("VERIFICATION_TOKEN");
const logOut = createAction("LOG_OUT");
const logOutUser = createAction("LOG_OUT_USER");

export {
	logInUser,
	logInUserFailed,
	logInUserSucceed,
	logInUserPending,
	verifyToken,
	logOut,
	logOutUser
};
