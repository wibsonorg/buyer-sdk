import { createReducer } from "redux-act";

// # State shape

// ```
// dataOrdersByAddress: {
//   "0xffffff": {
//     data: {

//     },
//     pending: true,
//     fulfilled: false,
//     closePending: true
//   },
//   "0xeeeeee": {
//     data: null,
//     fulfilled: false,
//     error: "Something went wrong"
//   }
// }
// ```

import * as Actions from "./actions";
import * as CloseDataOrderActions from "state/entities/closeDataOrder/actions";
import * as BuyDataOrderActions from "state/entities/buyDataOrder/actions";
import * as DataOrdersActions from "state/entities/createDataOrder/actions";

const initialState = {};

export default createReducer(
  {
    // BUY
    [BuyDataOrderActions.buyDataResponses]: (state, { orderAddress }) => {
      return {
        ...state,
        [orderAddress]: {
          ...state[orderAddress],
          buyPending: true
        }
      };
    },
    // TODO: there is a race condition here.
    // If the polling succeeds during the close process, the old state will be stored.
    // There are workarounds, but it doesn't matter right now.
    [BuyDataOrderActions.buyDataResponsesSucceed]: (
      state,
      { orderAddress }
    ) => {
      return {
        ...state,
        [orderAddress]: {
          data: { ...state[orderAddress].data, responsesSelected: true },
          buyPending: false
        }
      };
    },
    [BuyDataOrderActions.buyDataResponsesFailed]: (
      state,
      { orderAddress, error }
    ) => {
      return {
        ...state,
        [orderAddress]: {
          ...state[orderAddress],
          buyPending: false,
          buyError: error
        }
      };
    },
    [DataOrdersActions.createDataOrderSucceed]: (state, { dataOrder }) => {
      return {
        ...state,
        [dataOrder.orderAddress]: {
          data: dataOrder,
          pending: false,
          fulfilled: true,
          error: false
        }
      };
    },
    // CLOSE
    [CloseDataOrderActions.closeDataOrderSucceed]: (
      state,
      { dataOrder: { orderAddress } }
    ) => {
      return {
        ...state,
        [orderAddress]: {
          data: {
            ...state[orderAddress].data,
            transactionCompleted: true,
            transactionCompletedAt: Date.now() / 1000,
            status: "TransactionCompleted"
          },
          closePending: false
        }
      };
    },
    [CloseDataOrderActions.closeDataOrder]: (
      state,
      { dataOrder: { orderAddress } }
    ) => {
      return {
        ...state,
        [orderAddress]: {
          ...state[orderAddress],
          closePending: true
        }
      };
    },
    [CloseDataOrderActions.closeDataOrderFailed]: (
      state,
      { dataOrder: { orderAddress }, error }
    ) => {
      return {
        ...state,
        [orderAddress]: {
          ...state[orderAddress],
          closePending: false,
          closeError: error
        }
      };
    },
    // FETCH
    [Actions.fetchDataOrderData]: (state, { orderAddress }) => ({
      ...state,
      [orderAddress]: {
        data: state[orderAddress] && state[orderAddress].data,
        pending: true,
        fulfilled: false,
        error: false
      }
    }),
    [Actions.fetchDataOrderDataFailed]: (state, { orderAddress, error }) => {
      return {
        ...state,
        [orderAddress]: {
          data: state[orderAddress] && state[orderAddress].data,
          pending: false,
          fulfilled: false,
          error: error
        }
      };
    },
    [Actions.fetchDataOrderDataSucceed]: (state, { orderAddress, data }) => ({
      ...state,
      [orderAddress]: {
        data,
        pending: false,
        fulfilled: true,
        error: false
      }
    })
  },
  initialState
);
