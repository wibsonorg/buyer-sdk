/* eslint-disable */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config();

var _process = process,
    env = _process.env;


var config = {
  env: env.NODE_ENV,
  port: env.PORT,
  host: env.HOST,
  logType: env.LOG_TYPE,
  log: {
    error: env.ERROR_LOG,
    combined: env.COMBINED_LOG
  },
  contracts: {
    chainId: env.CHAIN_ID,
    dataExchange: {
      address: env.DATA_EXCHANGE_CONTRACT_ADDRESS,
      newOrder: { gasLimit: env.TX_NEW_ORDER_GAS_LIMIT },
      addDataResponseToOrder: { gasLimit: env.TX_ADD_DATA_RESPONSE_TO_ORDER_GAS_LIMIT }
    },
    wibcoin: {
      address: env.WIBCOIN_CONTRACT_ADDRESS,
      increaseApproval: {
        gasLimit: env.TX_INCREASE_APPROVAL_GAS_LIMIT
      }
    }
  },
  buyer: {
    privateKey: env.BUYER_PRIVATE_KEY
  }
};

exports.default = config;
