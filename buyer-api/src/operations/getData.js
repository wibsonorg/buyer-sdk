import { parseAsync } from 'json2csv';
import { getRawOrderData } from '../utils/wibson-lib/s3';

const NOT_FOUND = {
  code: 'getData.not_found',
  message: "The data couldn't be found",
};

const CSV_FILE_ERROR = {
  code: 'getData.csv_error',
  message: 'Error to generate csv file',
};

/**
 * @async
 * @param {String} orderId the internal id of the order.
 */
export const getData = async (orderId) => {
  const data = await getRawOrderData(orderId);
  if (!data) {
    return { error: NOT_FOUND };
  }
  const fields = ['email'];
  const opts = { fields };

  const csv = await parseAsync(data, opts);

  if (csv) {
    return { data: csv };
  }
  return { error: CSV_FILE_ERROR };
};
