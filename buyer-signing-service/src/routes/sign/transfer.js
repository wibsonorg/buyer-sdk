import express from 'express';
import { asyncError } from '../../helpers';
import transferWIBFacade from '../../facades/sign/transferWIBFacade';
import transferETHFacade from '../../facades/sign/transferETHFacade';
import config from '../../../config';

const router = express.Router();

router.post('/transfer/:currency', asyncError(async (req, res) => {
  const { contracts: { token } } = req.app.locals;
  const { nonce, gasPrice, params } = req.body;
  const { currency } = req.params;

  let operation = null;
  if (currency === 'wib') {
    operation = transferWIBFacade;
  } else if (currency === 'eth') {
    operation = transferETHFacade;
  }

  if (operation) {
    const response = operation(nonce, gasPrice, params, token, {
      chainId: config.contracts.chainId,
      gasLimit: config.contracts.wibcoin.transfer.gasLimit,
      to: config.contracts.wibcoin.address,
    });

    if (response.success()) {
      res.json({ signedTransaction: response.result });
    } else {
      res.boom.badData('Operation failed', {
        errors: response.errors,
      });
    }
  } else {
    res.boom.badData('Invalid currency');
  }
}));

export default router;
