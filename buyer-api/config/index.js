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
  buyerPublicBaseUrl: env.BUYER_PUBLIC_BASE_URL,
  buyerSigningServiceUrl: env.BUYER_SIGNING_SERVICE_URL,
  contracts: {
    addresses: {
      wibcoin: env.WIBCOIN_ADDRESS,
      dataExchange: env.DATA_EXCHANGE_ADDRESS,
      batPay: env.BATPAY_ADDRESS,
    },
    gasPrice: {
      standard: env.GAS_PRICE_STANDARD,
      fast: env.GAS_PRICE_FAST,
    },
    cache: {
      notaryTTL: env.CONTRACTS_CACHE_NOTARY_TTL,
    },
  },
  cache: {
    enabled: env.CACHE === 'enabled',
    adapter: env.CACHE_ADAPTER,
  },
  logType: env.LOG_TYPE,
  log: {
    error: env.ERROR_LOG,
    combined: env.COMBINED_LOG,
  },
  web3: {
    provider: env.WEB3_PROVIDER,
  },
  redis: {
    url: env.REDIS_URL,
    prefix: env.REDIS_PREFIX,
  },
  storage: {
    url: env.STORAGE_URL,
    region: env.STORAGE_REGION,
    user: env.STORAGE_USER,
    password: env.STORAGE_PASSWORD,
    bucket: env.STORAGE_BUCKET,
  },
  levelDirectory: env.LEVEL_DIRECTORY,
  jwt: JSON.parse(env.JWT_OPTIONS),
  passphrase: env.PASSPHRASE,
  contractEventListener: {
    interval: Number(env.CONTRACT_EVENT_LISTENER_INTERVAL),
    lastProcessedBlock: Number(env.CONTRACT_EVENT_LISTENER_LAST_PROCESSED_BLOCK),
  },
  checkBatPayBalance: {
    interval: Number(env.CHECK_BATPAY_BALANCE_INTERVAL),
    multiplier: Number(env.CHECK_BATPAY_BALANCE_MULTIPLIER),
  },
  balance: {
    minWei: env.BALANCE_MINIMUM_WEI,
    minWib: env.BALANCE_MINIMUM_WIB,
    minBatPay: env.BALANCE_MINIMUM_BATPAY,
  },
  transactionQueue: {
    maxIterations: env.TRANSACTION_QUEUE_MAX_ITERATIONS,
    interval: env.TRANSACTION_QUEUE_INSPECTION_INTERVAL,
  },
  dataResponseQueue: {
    batchSize: Number(env.DATA_RESPONSE_QUEUE_MAX_BATCH_SIZE),
  },
  sendBatchPassphrase: env.SEND_BATCH_PASSPHRASE,
};

exports.default = config;
