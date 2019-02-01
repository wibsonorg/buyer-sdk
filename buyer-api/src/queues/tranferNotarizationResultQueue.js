
import { createQueue } from './createQueue';
import { transferNotarizacionResult } from '../services/notaryService';

const createTranferNotarizationResultQueue = () => {
  const queue = createQueue('TranferNotarizationResult');

  queue.process('TranferNotarizationResult', async (
    { data: { notarizationResult } },
  ) => {
    await transferNotarizacionResult(notarizationResult);
  });

  return queue;
};

const tranferNotarizationResultQueue = createTranferNotarizationResultQueue();

export { tranferNotarizationResultQueue };
