// TODO: This is a temporal solution, this file should not exist
import td from 'testdouble';
import asyncRedis from 'async-redis';
import redisMock from 'redis-mock';
import createLevel from 'level-test';

process.env.ERROR_LOG = 'logs/error.test.log';
process.env.COMBINED_LOG = 'logs/combined.test.log';
process.env.WEB3_PROVIDER = 'http://localhost:8545';
process.env.BUYER_SIGNING_SERVICE_URL = 'http://localhost:9101';
process.env.REDIS_SOCKET = '/tmp/redis.sock';
process.env.LEVEL_DIRECTORY = 'tmp/test';
process.env.STORAGE_URL = 's3://storage.wibson.org';
process.env.STORAGE_REGION = 'eu-central-1';
process.env.STORAGE_BUCKET = 'wibson-storage';
process.env.PASSPHRASE = 'pass';
process.env.JWT_OPTIONS = '{ "secret": "secret", "expiration": "1d" }';
process.env.SLACK_LOG = 'https://hooks.slack.com/services/foo/bar/baz';
process.env.WIBCOIN_ADDRESS = '0x6ae42f46f84fd1e226443610b57ef5fa65a001c9';
process.env.DATA_EXCHANGE_ADDRESS = '0x79ee611a8f7a448ca7406693beb1858a8ec7415a';
process.env.ALLOWANCE_MINIMUM = 100000000000;
process.env.ALLOWANCE_MULTIPLIER = 5;
process.env.GAS_PRICE_FAST = 10000000000;
process.env.BALANCE_MINIMUM_WIB = 100000000000;
process.env.BALANCE_MINIMUM_WEI = 10000000000000000;
process.env.TRANSACTION_QUEUE_MAX_ITERATIONS = 5;
process.env.TRANSACTION_QUEUE_INSPECTION_INTERVAL = 5;

const level = createLevel();

td.replace('../src/utils/storage', {
  createRedisStore: () => asyncRedis.decorate(redisMock.createClient()),
  createLevelStore: ns => level(ns),
});
