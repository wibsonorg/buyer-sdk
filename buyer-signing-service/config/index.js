/* eslint-disable strict */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

// TODO: Consider moving config folder to src, since tests must not use it.
// Do NOT use dotenv here. Let the loadEnv function in src/loadEnv handle that.
const { env } = process;

const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  logType: env.LOG_TYPE,
  log: {
    error: env.ERROR_LOG,
    combined: env.COMBINED_LOG,
  },
  contracts: {
    chainId: env.CHAIN_ID,
    dataExchange: {
      address: env.DATA_EXCHANGE_CONTRACT_ADDRESS,
      newOrder: { gasLimit: env.TX_NEW_ORDER_GAS_LIMIT },
      addNotaryToOrder: { gasLimit: env.TX_ADD_NOTARY_TO_ORDER_GAS_LIMIT },
      addDataResponseToOrder: { gasLimit: env.TX_ADD_DATA_RESPONSE_TO_ORDER_GAS_LIMIT },
      closeOrder: { gasLimit: env.TX_CLOSE_ORDER_GAS_LIMIT },
    },
    wibcoin: {
      address: env.WIBCOIN_CONTRACT_ADDRESS,
      increaseApproval: {
        gasLimit: env.TX_INCREASE_APPROVAL_GAS_LIMIT,
      },
    },
  },
  buyer: {
    privateKey: env.BUYER_PRIVATE_KEY,
  },
};

exports.default = config;
