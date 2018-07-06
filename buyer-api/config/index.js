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
  buyerSigningServiceUrl: env.BUYER_SIGNING_SERVICE_URL,
  cache: {
    enabled: env.CACHE === 'enabled',
    adapter: env.CACHE_ADAPTER
  },
  logType: env.LOG_TYPE,
  log: {
    error: env.ERROR_LOG,
    combined: env.COMBINED_LOG
  },
  web3: {
    provider: env.WEB3_PROVIDER
  },
  redis: {
    socket: env.REDIS_SOCKET
  }
};

exports.default = config;
