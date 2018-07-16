import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = 0;

export default createReducer(
  {
    [Actions.updateTokenBalance]: (state, payload) => payload
  },
  initialState
);
