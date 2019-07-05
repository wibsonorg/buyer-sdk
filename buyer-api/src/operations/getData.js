import { parseAsync } from 'json2csv';
import { getRawOrderData } from '../utils/wibson-lib/s3';

const NOT_FOUND = {
  code: 'getData.not_found',
  message: "The data couldn't get",
};

const PRECONDITION_FAILED = {
  code: 'getData.precondition_failed',
  message: "The data couldn't get",
};

const CSV_FILE_ERROR = {
  code: 'getData.csv_error',
  message: 'Error to generate csv file',
};

/**
 * @async
 * @param {String} orderId the internal id of the order.
 */
export const getData = async (dataOrder) => {
  if (!dataOrder.requestedData.includes('google-profile')) {
    return { error: PRECONDITION_FAILED };
  }

  const data = await getRawOrderData(dataOrder.dxId);

  if (!data) {
    return { error: NOT_FOUND };
  }

  const fields = ['email.google-profile'];
  const opts = { fields };

  const csv = await parseAsync(Object.values(data), opts);

  if (csv) {
    return { data: csv };
  }
  return { error: CSV_FILE_ERROR };
};
