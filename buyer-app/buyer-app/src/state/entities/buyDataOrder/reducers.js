import { createReducer } from "redux-act";

import * as Actions from "./actions";

const buyStatusInitialState = {
  pending: false,
  fulfilled: false,
  error: null
};

const buyStatus = createReducer(
  {
    [Actions.buyDataResponses]: state => ({
      ...state,
      pending: true,
      fulfilled: false
    }),

    [Actions.buyDataResponsesSucceed]: (state, dataOrder) => ({
      ...state,
      fulfilled: true,
      pending: false
    }),
    [Actions.buyDataResponsesFailed]: (state, error) => ({
      ...state,
      error,
      pending: false,
      fulfilled: false
    })
  },
  buyStatusInitialState
);

export default buyStatus;
