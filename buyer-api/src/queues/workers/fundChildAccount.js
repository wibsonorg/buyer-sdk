import signingService from '../../services/signingService';
import { toBN, transferWIB, transferETH } from '../../facades';

export default async ({ progress, data: { accountNumber, config } }) => {
  const { root, children } = await signingService.getAccounts();
  const { address } = children[accountNumber];

  const wibTx = await transferWIB(root, address, {
    min: toBN(config.wib.min),
    max: toBN(config.wib.max),
  });

  progress('1/2');

  const ethTx = transferETH(root, address, {
    min: toBN(config.eth.min),
    max: toBN(config.eth.max),
  });

  progress('2/2');

  return { wibTx, ethTx };
};
