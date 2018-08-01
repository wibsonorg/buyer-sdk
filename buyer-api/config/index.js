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
  contracts: {
    addresses: {
      wibcoin: env.WIBCOIN_ADDRESS,
      dataExchange: env.DATA_EXCHANGE_ADDRESS
    },
    cache: {
      notaryTTL: env.CONTRACTS_CACHE_NOTARY_TTL,
      ordersTTL: env.CONTRACTS_CACHE_ORDERS_TTL
    }
  },
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
  },
  storage: {
    url: env.STORAGE_URL,
    region: env.STORAGE_REGION,
    user: env.STORAGE_USER,
    password: env.STORAGE_PASSWORD,
    bucket: env.STORAGE_BUCKET,
  },
  levelDirectory: env.LEVEL_DIRECTORY
};

exports.default = config;
