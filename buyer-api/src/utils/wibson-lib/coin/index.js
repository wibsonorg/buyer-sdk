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
 * @returns {String} amount of Wibcoins
 */
export const toWib = (bigNumber, base = 10) => {
  const bn = new BN(bigNumber);

  if (bn.isGreaterThan(wibcoinSupply)) {
    return Infinity;
  }

  if (bn.isNaN()) {
    return NaN;
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
 * @returns {String} BigNumber converted units
 */
export const fromWib = (wib, base = 10) => {
  let bn = new BN(wib);

  if (bn.isNaN()) {
    return NaN;
  }

  bn = bn.multipliedBy(oneWibcoin);
  if (bn.isGreaterThan(wibcoinSupply)) {
    return Infinity;
  }

  return bn.toString(base);
};
