/**
 * Builds bytes format for BatPay.Transfer
 * [1, 3, 5, 7] -> '0xff04...'
 * first byte should be ff, second is element length in bytes
 * the rest are the id deltas in hex format
 * @param {number[]} ids list of ids to send as payData
 */
export const packPayData = ids => `0xff04${ids
  .sort((a, b) => a - b)
  .map((id, i, l) => id - (l[i - 1] || 0))
  .map(d => d % (256 ** 4))
  .map(d => d.toString(16).padStart(8, '0'))
  .join('')
}`;

/**
 * Retrives ids from bytes format
 * '0xff04...' -> [1, 3, 5, 7]
 * @param {Buffer} bytes list of ids to send as payData
 */
export const unpackPayData = bytes =>
  ((bytes.startsWith('0x') ? bytes.slice(2) : bytes)
    .slice(4)
    .match(/.{8}/img) || [])
    .map(hex => parseInt(hex, 16))
    .reduce((arr, d) => [...arr, d + Number(arr.slice(-1))], []);
