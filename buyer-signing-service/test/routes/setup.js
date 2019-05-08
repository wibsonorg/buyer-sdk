import config from '../../config';

before(() => {
  config.contracts.chainId = 9697;
  config.buyer.privateKey = '123fa47078166dd487b92f856bfb4685dac280f486670248267450f10062f6e8';
  config.contracts.WIBToken.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
  config.contracts.WIBToken.increaseApproval.gasLimit = 30000;
  config.contracts.DataExchange.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
  config.contracts.DataExchange.createDataOrder.gasLimit = 30000;
  config.contracts.DataExchange.closeDataOrder.gasLimit = 2000000;
  config.contracts.BatPay.address = '0xf3b435d66a6156622e1b3c1a974d25cdbf6032aa';
  config.contracts.BatPay.registerPayment.gasLimit = 30000;
  config.contracts.BatPay.deposit.gasLimit = 30000;
});
