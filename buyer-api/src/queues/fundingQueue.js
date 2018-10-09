import { createQueue } from './createQueue';

const fundingQueue = createQueue('FundingQueue');

fundingQueue.process('sendFunds', 1, `${__dirname}/workers/sendFunds.js`);
fundingQueue.process('transferWIB', 1, `${__dirname}/workers/transferWIB.js`);
fundingQueue.process('transferETH', 1, `${__dirname}/workers/transferETH.js`);
fundingQueue.process('checkStatus', 1, `${__dirname}/workers/checkStatus.js`);

export { fundingQueue };
