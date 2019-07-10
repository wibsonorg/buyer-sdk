import { parseAsync } from 'json2csv';
import { getRawOrderData } from '../utils/wibson-lib/s3';

const NOT_FOUND = {
  code: 'getData.not_found',
  message: "The data couldn't be found",
};

const PRECONDITION_FAILED = {
  code: 'getData.precondition_failed',
  message: "We don't support downloads for this type of data yet",
};

const CSV_FORMAT_ERROR = {
  code: 'getData.csv_error',
  message: 'Error to generate csv',
};

/**
 * @async
 * @param {String} orderId the internal id of the order.
 */
export const getOrderData = async (dataOrder) => {
  if (!dataOrder.requestedData.includes('google-profile')) {
    return { error: PRECONDITION_FAILED };
  }

  const data = await getRawOrderData(dataOrder.dxId);

  if (!data) {
    return { error: NOT_FOUND };
  }

  const fields = [
    {
      label: 'email',
      value: 'google-profile.email',
    },
  ];
  const opts = { fields };

  const csv = await parseAsync(Object.values(data), opts);

  if (csv) {
    return { data: csv };
  }
  return { error: CSV_FORMAT_ERROR };
};
