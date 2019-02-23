export const priority = {
  URGENT: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  LOWEST: 5,
};

export const TxPriorities = {
  IncreaseApproval: priority.URGENT,
  Deposit: priority.URGENT,
  CreateDataOrder: priority.HIGH,
  CloseDataOrder: priority.LOW,
  BuyDataBatch: priority.LOWEST,
};
