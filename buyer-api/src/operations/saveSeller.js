import { sellers } from '../utils/stores';

/**
 * @function saveSeller
 * take seller id and stores it with the address
 * @param {string} sellerAddress Seller's ethereum address.
 * @param {number} sellerId Seller's unique ID.
 */
export const saveSeller = async (sellerAddress, sellerId) => {
  const seller = await sellers.safeFetch(sellerAddress);
  if (seller && seller === sellerId) {
    return true;
  } else if (seller) {
    return false;
  }

  await sellers.put(sellerAddress, sellerId);
  return true;
};
