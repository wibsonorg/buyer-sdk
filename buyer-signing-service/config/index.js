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
    DataExchange: {
      address: env.DATA_EXCHANGE_ADDRESS,
      createDataOrder: { gasLimit: env.TX_CREATE_DATA_ORDER_GAS_LIMIT },
      closeDataOrder: { gasLimit: env.TX_CLOSE_DATA_ORDER_GAS_LIMIT },
    },
    BatPay: {
      address: env.BATPAY_ADDRESS,
      registerPayment: { gasLimit: env.TX_BATPAY_REGISTER_PAYMENT_GAS_LIMIT },
      deposit: { gasLimit: env.TX_BATPAY_DEPOSIT_GAS_LIMIT },
    },
    WIBToken: {
      address: env.WIBCOIN_ADDRESS,
      increaseApproval: { gasLimit: env.TX_TOKEN_INCREASE_APPROVAL_GAS_LIMIT },
    },
  },
  buyer: {
    privateKey: env.BUYER_PRIVATE_KEY,
  },
};

exports.default = config;
