/**
 * FakeProvider should be used to send rpc calls over http
 */
const FakeProvider = function FakeProvider(timeout = 1000) {
  this.timeout = timeout;
  this.responses = [];
};

/**
 * Adds a JSON RPC response. There can be multiple responses for the same
 * `method`.
 *
 * @method addResponse
 * @param {String} method
 * @param {*} result
 */
FakeProvider.prototype.addResponse = function addResponse(method, result) {
  this.responses = [...this.responses, {
    method,
    jsonrpc: '2.0',
    result,
  }];
};

FakeProvider.prototype.removeResponse = function removeResponse(_method) {
  let responseFound = null;

  this.responses = this.responses.reduce((accumulator, { method, ...rest }) => {
    if (!responseFound && method === _method) {
      responseFound = rest;
      return accumulator;
    }

    return [...accumulator, { method, ...rest }];
  }, []);

  return responseFound;
};

FakeProvider.prototype.clear = function clear() {
  this.responses = [];
};

/**
 * It fakes an async request
 *
 * @method send
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
FakeProvider.prototype.send = function send(payload, callback) {
  const { jsonrpc, id, method } = payload;
  const response = this.removeResponse(method);

  if (response === null) {
    callback(new Error(`No response for method: '${method}'`));
  }

  const { result } = response;
  setTimeout(() => callback(null, {
    id,
    jsonrpc,
    result,
  }), this.timeout);
};

module.exports = FakeProvider;
