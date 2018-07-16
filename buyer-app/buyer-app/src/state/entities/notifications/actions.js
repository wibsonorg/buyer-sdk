import { createAction } from "redux-act";

const popOutNotification = createAction("POP_OUT_NOTIFICATION");
const createNotification = createAction("PUSH_IN_NOTIFICATION");

export { popOutNotification, createNotification };
