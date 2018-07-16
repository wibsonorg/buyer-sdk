import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = null;

export default createReducer(
  {
    [Actions.fetchNotariesFailed]: (state, payload) => ({
      pending: false,
      error: payload.message,
      fulfilled: false
    }),
    [Actions.fetchNotariesSucceed]: (state, payload) => ({
      ...state,
      list: payload,
      pending: false,
      fulfilled: true
    }),
    [Actions.fetchNotariesPending]: (state, payload) => ({
      ...state,
      pending: true,
      fulfilled: false
    })
  },
  initialState
);
