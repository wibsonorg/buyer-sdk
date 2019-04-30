import { serial as it, beforeEach } from 'ava';
import { lock } from '../../src/utils/lock';

let count;
beforeEach(() => { count = 0; });

function testFn(lockFn, requests) {
  const length = 666;
  const defers = Object.assign(Array.from({ length }, () => {
    let exec;
    const promise = new Promise((res) => { exec = res; });
    let finish;
    const finished = new Promise((res) => { finish = res; });
    return {
      exec, promise, finish, finished,
    };
  }), {
    execAll() { defers.forEach(({ exec }) => exec()); },
  });
  for (let i = 0; i < length; i += 1) {
    // eslint-disable-next-line no-loop-func
    lockFn(requests, async () => {
      const c = count;
      await defers[i].promise;
      count = c + 1;
      defers[i].finish();
    });
  }
  return defers;
}

it('testFn doesnt works without lock', async (assert) => {
  const defers = testFn((requests, fn) => fn());
  assert.is(count, 0);
  defers.execAll();
  await Promise.all(defers.map(d => d.finished)).then(() => {
    assert.is(count, 1);
  });
});

it('locks all from accessing a resource with no tags', async (assert) => {
  const defers = testFn(lock, [['count']]);
  assert.is(count, 0);
  defers.execAll();
  await Promise.all(defers.map(u => u.finished)).then(() => {
    assert.is(count, defers.length);
  });
});

it('doesnt lock when keys are different', async (assert) => {
  let resource = 0;
  let goGreen;
  const semaphore = new Promise((res) => { goGreen = res; });
  const jobs = Promise.all([
    lock([['resource', 3]], async () => {
      const r = resource;
      await semaphore;
      resource = r + 3;
    }),
    lock([['resource', 7]], async () => {
      const r = resource;
      await semaphore;
      resource = r + 7;
    }),
  ]);
  goGreen();
  await jobs;
  assert.is(resource, 7);
});

it('locks when keys are equals', async (assert) => {
  let resource = 0;
  let goGreen;
  const semaphore = new Promise((res) => { goGreen = res; });
  const jobs = Promise.all([
    lock([['resource', 13]], async () => {
      const r = resource;
      await semaphore;
      resource = r + 3;
    }),
    lock([['resource', 13]], async () => {
      const r = resource;
      await semaphore;
      resource = r + 7;
    }),
  ]);
  goGreen();
  await jobs;
  assert.is(resource, 10);
});

it('locks if no key is present', async (assert) => {
  let resource = 0;
  let goGreen;
  const semaphore = new Promise((res) => { goGreen = res; });
  const jobs = Promise.all([
    lock([['resource']], async () => {
      const r = resource;
      await semaphore;
      resource = r + 3;
    }),
    lock([['resource', 13]], async () => {
      const r = resource;
      await semaphore;
      resource = r + 5;
    }),
    lock([['resource', 33]], async () => {
      const r = resource;
      await semaphore;
      resource = r + 7;
    }),
  ]);
  goGreen();
  await jobs;
  assert.is(resource, 10);
});
