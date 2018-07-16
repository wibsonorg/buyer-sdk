import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = 0;

export default createReducer(
  {
    [Actions.updateAccount]: (state, payload) => payload
  },
  initialState
);
