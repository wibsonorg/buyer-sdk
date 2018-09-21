import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = null;

export default createReducer(
  {
    [Actions.logInUserFailed]: (state, payload) => ({
      pending: false,
      authenticated: undefined,
      logInError: payload.message,
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
    }),
    [Actions.logOutUser]: (state, payload) => ({
      ...state,
      authenticated: undefined,
      pending: false,
      fulfilled: false
    })
  },
  initialState
);
