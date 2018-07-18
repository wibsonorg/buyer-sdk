import { createReducer } from 'redux-act';

import * as Actions from './actions';

const initialState = {};

export default createReducer(
  {
    [Actions.fetchMinimumInitialBudgetSucceed]: (state, minimumBudget) => ({
      ...state,
      minimumBudget,
    }),
    [Actions.fetchMinimumInitialBudgetFailed]: (state, { error }) => ({
      ...state,
      minimumBudget: undefined,
      error,
    }),
  },
  initialState,
);
