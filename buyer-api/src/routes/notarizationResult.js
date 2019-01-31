import express from 'express';
import { asyncError, validateFields } from '../utils';
import { getNotarizationRequest } from '../facades';


const router = express.Router();

/**
 * @swagger
 * /notarization-result/:notarizationRequestId:
 *   post:
 *     description: 
 *     parameters:
 *       - name: notaryAddress
 *         description: Notary's ethereum address
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: When the notary could be fetched correctly.
 *       404:
 *         description: When the notary is not registered in the Data Exchange.
 *       500:
 *         description: When the fetch failed.
 */
router.post(
  '/:notarizationRequestId',
  asyncError(async (req, res) => {
    req.apicacheGroup = '/notaries/*';
    const { notarizationRequestId } = req.params;
    const notarizationResult = req.body;

    let validation = validateFields(notarizationResult)
    if( validation.length > 0 ){
      res.status(422).json({
        "statusCode": 422,
        "statusText": "Unprocessable Entity",
        "message": "Parameters missing",
        "errors": validation
      });
    } else {
      let request = getNotarizationRequest(notarizationRequestId)
      if(!request) {
        res.status(400).json({
          "statusCode": 400,
          "message": "Could not find a request whith the id provided"
        });
      }
      else {
        console.log("final")
        res.status(202).json({ message: "OK" });
      }
    }
  }),
);

export default router;
