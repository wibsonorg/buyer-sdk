import { createReducer } from "redux-act";

import * as Actions from "./actions";

const initialState = {
  data: null,
  fulfilled: false,
  pending: false
};

export default createReducer(
  {
    [Actions.fetchDataOrdersAddresses]: state => ({
      ...state,
      pending: true,
      fulfilled: false,
      error: false
    }),
    [Actions.fetchDataOrdersAddressesFailed]: (state, { error }) => ({
      ...state,
      error,
      pending: false,
      fulfilled: false
    }),
    [Actions.fetchDataOrdersAddressesSucceed]: (state, { data }) => ({
      ...state,
      data: { ...state.data, data },
      error: false,
      pending: false,
      fulfilled: true
    })
  },
  initialState
);
