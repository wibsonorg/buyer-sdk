/**
 * Checks destinatary's balance and transfers funds if needed.
 *
 * @async
 * @param {Object} root Buyer's root account
 * @param {String} child Buyer's child account ethereum address
 * @param {Function} getBalance Balance getter
 * @param {Number} min Minimum required balance
 * @param {Number} max Maximum allowed balance
 */
export const checkAndTransfer = (child, getBalance, send, min, max) => {
  const balance = getBalance(child.address);
  if (balance.greaterThanOrEqualTo(min)) return false;

  return send({
    _to: child.address,
    _value: max.minus(balance).toString(),
  });
};
