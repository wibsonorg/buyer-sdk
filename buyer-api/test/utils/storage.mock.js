import td from 'testdouble';
import sinon from 'sinon';
import test from 'ava';

export const config = {
  levelDirectory: 'someDirectory',
  redis: {
    url: 'someUrl',
    prefix: 'somePrefix',
  },
};
td.replace('../../config', config);
export const fakeRedis = {};
export const redis = { createClient: sinon.stub().returns(fakeRedis) };
td.replace('redis', redis);
export const fakeDecoratedRedis = {};
export const asyncRedis = { decorate: sinon.stub().returns(fakeDecoratedRedis) };
td.replace('async-redis', asyncRedis);
export const fakeFile = [
  { key: 'a', value: '{"a":1}' },
  { key: 'b', value: '{"b":2}' },
  { key: 'c', value: '{"c":3}' },
];
const createFakeStream = (mapper) => {
  const f = fakeFile.map(mapper);
  f.on = (e, cb) => {
    if (e === 'data') {
      f.forEach(x => cb(x));
    }
    if (e === 'end') cb();
    return f;
  };
  return sinon.stub().returns(f);
};
export const fakeLevel = {
  get: sinon.stub().callsFake(async x => x),
  put: sinon.spy(),
  createReadStream: createFakeStream(x => x),
};
export const level = sinon.stub().returns(fakeLevel);
td.replace('level', level);

test.afterEach(sinon.resetHistory);
