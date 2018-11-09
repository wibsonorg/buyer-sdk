// TODO: This is a temporal solution, this file should not exist
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
