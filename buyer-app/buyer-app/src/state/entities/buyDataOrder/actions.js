import { createAction } from "redux-act";


const buyDataResponses = createAction("DATA_ORDER_BUY_RESPONSES");
const buyDataResponsesFailed = createAction("DATA_ORDER_BUY_RESPONSES_FAILED");
const buyDataResponsesSucceed = createAction("DATA_ORDER_BUY_RESPONSES_SUCCEED");



export {
  buyDataResponses,
  buyDataResponsesFailed,
  buyDataResponsesSucceed
};
