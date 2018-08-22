import { BigNumber } from 'bignumber.js';

const WIBCOIN_DECIMALS = 9;
const BN = BigNumber.clone({ DECIMAL_PLACES: WIBCOIN_DECIMALS });
const wibcoinSupply = new BN(9e18);
const oneWibcoin = new BN(1e9);

/**
 * Converts a BigNumber representing an amount of Wibcoins in a human-readable
 * way.
 *
 * Example:
 *   toWib('1e+10') #=> '10'
 *
 * @param {Number|String|BigNumber} bigNumber units to be conveted
 * @throws When argument is not a number or of it is out of range
 * @returns {String} amount of Wibcoins
 */
export const toWib = (bigNumber, base = 10) => {
  const bn = new BN(bigNumber);

  if (bn.isGreaterThan(wibcoinSupply)) {
    throw new Error('Argument out of range');
  }

  if (bn.isNaN()) {
    throw new Error('Argument is not a number');
  }

  return bn.dividedBy(oneWibcoin).toString(base);
};

/**
 * Converts an amount of Wibcoins to a BigNumber representation.
 *
 * Example:
 *   fromWib('10') #=> '1e+10'
 *
 * @param {Number|String|BigNumber} wib amount of Wibcoins
 * @throws When argument is not a number or of it is out of range
 * @returns {String} BigNumber converted units
 */
export const fromWib = (wib, base = 10) => {
  let bn = new BN(wib);

  if (bn.isNaN()) {
    throw new Error('Argument is not a number');
  }

  bn = bn.multipliedBy(oneWibcoin);
  if (bn.isGreaterThan(wibcoinSupply)) {
    throw new Error('Argument out of range');
  }

  return bn.toString(base);
};
