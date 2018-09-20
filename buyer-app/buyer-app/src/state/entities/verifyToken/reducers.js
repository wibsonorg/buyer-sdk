import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = null;

export default createReducer(
  {
    [Actions.verifyToken]: (state, payload) => payload
  },
  initialState
);