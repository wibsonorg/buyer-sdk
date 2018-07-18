import { createAction } from "redux-act";

const fetchMinimumInitialBudgetSucceed = createAction(
  "MINIMUM_INITIAL_BUDGET_FOR_AUDITS_FETCH_SUCCEED"
);
const fetchMinimumInitialBudgetFailed = createAction(
  "MINIMUM_INITIAL_BUDGET_FOR_AUDITS_FETCH_FAILED"
);

export {
  fetchMinimumInitialBudgetSucceed,
  fetchMinimumInitialBudgetFailed
};
