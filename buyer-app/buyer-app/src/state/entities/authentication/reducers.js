import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = null;

export default createReducer(
  {
    [Actions.logInUserFailed]: (state, payload) => ({
      pending: false,
      authenticated: undefined,
      error: payload,
      fulfilled: false
    }),
    [Actions.logInUserSucceed]: (state, payload) => ({
      ...state,
      authenticated: payload.authenticated,
      pending: false,
      fulfilled: true
    }),
    [Actions.logInUserPending]: (state, payload) => ({
      ...state,
      authenticated: undefined,
      pending: true,
      fulfilled: false
    })
  },
  initialState
);