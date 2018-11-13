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
process.env.NOTARY_DEMAND_AUDITS_FROM = '["0xfe174860ad53e45047BABbcf4aff735d650D9284"]';
process.env.TRANSACTION_QUEUE_MAX_ITERATIONS = 5;
process.env.TRANSACTION_QUEUE_INSPECTION_INTERVAL = 10;

const level = createLevel();

td.replace('../src/utils/storage', {
  createRedisStore: () => asyncRedis.decorate(redisMock.createClient()),
  createLevelStore: ns => level(ns),
});
