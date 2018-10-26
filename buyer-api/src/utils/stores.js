import { createLevelStore } from './storage';

const eventBlocks = createLevelStore('event_blocks');

export { eventBlocks };
