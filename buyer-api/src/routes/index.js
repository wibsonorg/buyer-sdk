/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: X-API-Key
 */

import account from './account';
import buyerInfos from './buyerInfos';
import health from './health';
import notaries from './notaries';
import dataOrders from './dataOrders';
import dataResponses from './dataResponses';
import metrics from './metrics';

export {
  account,
  buyerInfos,
  health,
  notaries,
  dataOrders,
  dataResponses,
  metrics,
};
