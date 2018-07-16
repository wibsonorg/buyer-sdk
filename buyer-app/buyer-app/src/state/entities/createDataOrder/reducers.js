import { createReducer } from "redux-act";

import * as Actions from "./actions";

const create = createReducer(
  {
    [Actions.createDataOrderClear]: () => ({}),
    [Actions.createDataOrderFailed]: (state, payload) => ({
      pending: false,
      error: payload.message
    }),
    [Actions.createDataOrderSucceed]: state => ({
      error: null,
      pending: false,
      fulfilled: true
    }),
    [Actions.createDataOrder]: (state, payload) => ({
      pending: true
    })
  },
  {}
);

export default create;