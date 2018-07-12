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
    addresses: {
      dataToken: env.DATA_TOKEN_CONTRACT_ADDRESS,
      dataExchange: env.DATA_EXCHANGE_CONTRACT_ADDRESS,
    },
  },
  transactions: {
    newOrder: { gasLimit: env.TX_NEW_ORDER_GAS_LIMIT }
  },
  buyer: {
    privateKey: env.BUYER_PRIVATE_KEY
  }
};

exports.default = config;
