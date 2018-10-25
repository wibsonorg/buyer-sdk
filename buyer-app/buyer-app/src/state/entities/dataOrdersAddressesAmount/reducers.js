import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = {
  data: null,
  fulfilled: false,
  pending: false
};

export default createReducer(
  {
    [Actions.fetchDataOrdersAddressesAmount]: state => ({
      ...state,
      pending: true,
      fulfilled: false,
      error: false
    }),
    [Actions.fetchDataOrdersAddressesAmountFailed]: (state, { error }) => ({
      ...state,
      error,
      pending: false,
      fulfilled: false
    }),
    [Actions.fetchDataOrdersAddressesAmountSucceed]: (state, { data }) => ({
      data,
      error: false,
      pending: false,
      fulfilled: true
    })
  },
  initialState
);
