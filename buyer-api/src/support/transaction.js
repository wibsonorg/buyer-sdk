/**
 * @param {Object} transaction the transaction where the event was emitted.
 */
const extractEventArguments = transaction => transaction.logs[0].args;

export default extractEventArguments;
