import { createReducer } from "redux-act";

import * as Actions from "./actions";
import { getCookie } from '../../../utils/cookies';

const initialState = {
  pending: false,
  authenticated: getCookie('token') !== undefined,
  logInError: undefined,
  fulfilled: false
};

export default createReducer(
  {
    [Actions.logInUserPending]: (state, payload) => ({
      pending: true,
      authenticated: undefined,
      logInError: undefined,
      fulfilled: false
    }),
    [Actions.logInUserSucceed]: (state, payload) => ({
      ...state,
      pending: false,
      authenticated: payload.authenticated,
      logInError: undefined,
      fulfilled: true
    }),
    [Actions.logInUserFailed]: (state, payload) => ({
      ...state,
      pending: false,
      authenticated: undefined,
      logInError: payload,
      fulfilled: false
    }),
    [Actions.logOutUser]: (state, payload) => ({
      ...state,
      pending: false,
      authenticated: undefined,
      logInError: undefined,
      fulfilled: false
    })
  },
  initialState
);
