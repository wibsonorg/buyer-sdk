import { createAction } from "redux-act";

const verifyToken = createAction("VERIFICATION");
const verifyTokenFailed = createAction("VERIFICATION_FAILED");

export { verifyToken, verifyTokenFailed };
