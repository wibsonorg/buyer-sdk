import { createLevelStore } from './storage';

const eventBlocks = createLevelStore('event_blocks');
const buyerInfos = createLevelStore('buyer_infos');
const buyerInfoPerOrder = createLevelStore('buyer_info_per_order');

export { eventBlocks, buyerInfos, buyerInfoPerOrder };
