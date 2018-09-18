import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = null;

export default createReducer(
  {
    [Actions.fetchAuthenticationFailed]: (state, payload) => ({
      pending: false,
      authenticated: undefined,
      error: payload,
      fulfilled: false
    }),
    [Actions.fetchAuthenticationSucceed]: (state, payload) => ({
      ...state,
      authenticated: payload.authenticated,
      pending: false,
      fulfilled: true
    }),
    [Actions.fetchAuthenticationPending]: (state, payload) => ({
      ...state,
      authenticated: undefined,
      pending: true,
      fulfilled: false
    })
  },
  initialState
);