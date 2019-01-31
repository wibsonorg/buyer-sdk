import {
  onBuyData,
  addDataResponse,
  closeDataResponse,
  checkAllowance,
} from './dataResponseFacade';
import { createDataOrderFacade } from './createDataOrderFacade';
import {
  addNotariesToOrderFacade,
  addNotaryToOrder,
} from './addNotariesToOrderFacade';
import closeDataOrderFacade from './closeDataOrderFacade';
import { getOrdersForBuyer, fetchAndCacheDataOrder, getOrdersAmountForBuyer } from './getOrdersFacade';

export {
  getNotaryInfo,
  getNotariesInfo,
  fetchAndCacheNotary,
} from './notariesFacade';

export { getNotarizationRequest } from './notarizationResFacade'

export {
  createDataOrderFacade,
  addNotariesToOrderFacade,
  addNotaryToOrder,
  getOrdersForBuyer,
  addDataResponse,
  closeDataResponse,
  closeDataOrderFacade,
  onBuyData,
  checkAllowance,
  fetchAndCacheDataOrder,
  getOrdersAmountForBuyer,
};
