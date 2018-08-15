## Transactions sent to Ethereum

Transaction sent to Ropsten, or Main Ethereum networks can have the following statuses:

* _Pending_
  The transaction is not mined into the blockchain, or it is mined but has not finished running at the time of the `getTransactionReceipt` query.
  The associated error logged is: `Pending tx ${txReceipt}`.
* _Successful_
  The transaction was mined into blockchain. `getTransactionReceipt` returns an object with status code `0x1`.
* _Failure_
  The transaction was mined into the blockchain, but code execution failed. `getTransactionReceipt` returns an object with status code `0x0`.
  Possible causes of failure:
    * The Smart Contract code execution began to run but stopped because of a condition not met (usually the condition checked by `require` calls)
    * The transaction went out of gas
* _Unknown_
  This case does not happen very often, but it happens. The error message is:
  ```
  The transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!
  ```

### Resilient Transaction Status follow up

The most resilient way we found to follow up the status of a transaction is to use a job processing subsystem (a.k.a. background processing or queue processing system). The state of this subsystem is persisted to Redis so, with a few precautions, jobs can be retried if the need arise, or the service can go down and start right from where it left.

Add DataResponse simplified example:

```js
const addDataResponse = async (order, seller, queue) => {
    // 1. Validate: Check against contract instance before sending anything.
    //              Input validation can also be done here.
    if (dataOrder.hasSellerBeenAccepted(seller)) {
        queue.add('addDataResponseSent', { receipt: null, order, seller })
        return true;
    }
    
    // 2. Sign and send transaction to the network
    // ...
    const receipt = sendTransaction(signedTx);
    
    // 3. Every other action depending on this transaction to wait until
    // it finishes, so another Job is enqueued for this purpose.
    queue.add('addDataResponseSent', { receipt, order, seller })
    return true;
}
```

For this to work, we need to define a Processor for the `addDataResponseSent` Job.

```js
const queue = createQueue('DataResponseQueue');
queue.process('addDataResponseSent', async ({ data }) => {
    const { receipt, order, seller } = data;
    if (receipt) {
        await getTransactionReceipt(receipt)
    }
    await doSomethingElse();
})
```

The call to `getTransactionReceipt` tries to fetch the transaction object and fails (raising an `Error`) when the status is `Pending`, `Unknown` or `Failed`.

#### Retries

Job retries are not set by default, so it is essential to specify the number of attempts and backoff algorithm at the time of adding a job.

In our example:
```js
queue.add(
    'addDataResponseSent', 
    { receipt, order, seller },
    {
        attempts: 20, // the job will be retried 20 times
        backoff: { type: 'linear' } // 1st 10sec after fail, 2nd 20 secs after, and so on...
    }
)
```

With this scheme, if the job fails with an error, the job processor retries the job.

#### Important aspects to take into account

1. __Idempotency__: As jobs can be retried many times it is important that the underneath transaction has no additional effect than calling the transaction only once. An explicit and safe approach is to check against the blockchain to send the transaction (see the very first lines of `addDataResponse`).
2. __Statuses__: `Pending` and `Unknown` Transactions Statuses should be retried. There is no need to retry `Failed` transactions since the smart contract code is saying that a condition is not met.
3. __Explicitly define what errors should not be retried__: in our example
```js
queue.process('addDataResponseSent', async ({ data }) => {
    const { receipt, order, seller } = data;
    try {
        if (receipt) {
            await getTransactionReceipt(receipt)
        }
        await doSomethingElse();
    } catch (error) {
        // `retryAfterError` handles common cases like a `Pending` transaction 
        // or a duplicated one.
        if (!retryAfterError(error) /* || another condition */) {
            // inform
        } else {
            throw error;
        }
    }
})
``` 
4. __Always inform__: There is a lot already done, failed jobs are logged with a reason. This will help us when tracing issues.
