import { sellers } from '../utils/stores';

/**
 * @function saveSeller
 * take seller id and stores it with the address
 * @param {string} sellerAddress Seller's ethereum address.
 * @param {number} sellerId Seller's unique ID.
 */
export const saveSeller = async (sellerAddress, sellerId) => {
  try {
    const seller = await sellers.get(sellerAddress);
    if (seller) {
      return false;
    }
  } catch (error) {
    // do nothing
  }
  await sellers.put(sellerAddress, sellerId);
  return true;
};
