import { createReducer } from "redux-act";

import * as Actions from "./actions";

const create = createReducer(
  {
    [Actions.downloadDataFailed]: payload => ({
      pending: false,
      error: payload.message
    }),
    [Actions.downloadDataSucceed]: () => ({
      error: null,
      pending: false,
      fulfilled: true
    }),
    [Actions.downloadData]: () => ({
      pending: true
    })
  },
  {}
);

export default create;
