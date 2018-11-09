import test from 'ava';

test.before(async () => {

});
// TODO: Add https://www.npmjs.com/package/web3-fake-provider
// sendTransaction
// waitForExecution
test.skip('retry transaction if connection to blockchain through web3 fails', t => t.fail());
test.skip('responds with error if same transaction is added twice', t => t.fail());
test.skip('responds tx if transaction succeeded', t => t.fail());
test.skip('responds tx if transaction failed', t => t.fail());
test.skip('throws error if transaction is still pending', t => t.fail());
test.skip('stops retrying if unknown tx status', t => t.fail());
