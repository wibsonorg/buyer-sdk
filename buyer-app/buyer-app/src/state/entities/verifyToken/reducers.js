import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = null;

export default createReducer(
  {
    [Actions.verifyTokenFailed]: (state, payload) => ({
      unAuthenticated: undefined,
      error: payload,
      fulfilled: false
    }),
  },
  initialState
);