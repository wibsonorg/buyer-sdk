export const priority = {
  URGENT: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  LOWEST: 5,
};

export const TxPriorities = {
  IncreaseApproval: priority.URGENT,
  NewOrder: priority.HIGH,
  AddNotaryToOrder: priority.HIGH,
  AddDataResponse: priority.LOWEST,
  CloseDataResponse: priority.MEDIUM,
  CloseOrder: priority.LOW,
};
