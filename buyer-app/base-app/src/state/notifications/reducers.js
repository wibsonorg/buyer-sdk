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
  // debugger;
  // Catch every FAILED action.

  // if (action.type.endsWith("_FAILED")) {
  //   console.log("FAILED: ", action.type, action.payload);
  //   return [
  //     ...state,
  //     {
  //       message: action.payload.message,
  //       status: "critical"
  //     }
  //   ];
  // }

  // Remove last notification.
  if (action.type === "POP_OUT_NOTIFICATION") {
    return R.remove(0, 1, state);
  }

  return successulActionsReducer(state, action);
}
