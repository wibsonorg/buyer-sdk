import R from "ramda";

import { createReducer } from "redux-act";
import * as NotificationActions from "./actions";

const initialState = [];

const successulActionsReducer = createReducer(
  {
    [NotificationActions.createNotification.getType()]: (state, payload) => [
      ...state,
      payload
    ]
  },
  initialState
);

export default function(state = initialState, action) {
  // Remove last notification.
  if (action.type === "POP_OUT_NOTIFICATION") {
    return R.remove(0, 1, state);
  }

  return successulActionsReducer(state, action);
}
