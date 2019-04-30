/* eslint-disable eqeqeq */
const locks = [];
/**
 * Stops execution of fn until resources are free
 * it will only lock the execution if there is a lock that shares some tag
 * or; the tag or the request locks the whole resource (no tags)
 * most common usage:
 *  lock([[resource]], async () =>{
 *    ...some async code with await...
 *  })
 * WARNING: a lock inside a lock can cause a deadlock
 *          if they both lock the same resource
 * @param {any[][]} requests A list of resource requests with tags
 * @param {() => T} fn The code to lock until resources are free
 * @returns {T} The result of fn
 * @template T
 */
export async function lock(requests, fn) {
  const locksPromises = locks
    .filter(l => requests.some(req =>
      l[0] == req[0] && (
        l.length == 1 || req.length == 1 ||
        req.filter(rk => l.some(lk => rk == lk)).length > 1
      )))
    .map(l => l.promise);
  let release;
  const promise = new Promise((res) => { release = res; });
  requests.forEach((req) => { req.promise = promise; });
  locks.push(...requests);
  await Promise.all(locksPromises);
  try { return await fn(); } finally {
    locks.splice(locks.findIndex(l => l.promise === promise), requests.length);
    release();
  }
}
