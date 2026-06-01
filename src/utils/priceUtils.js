/**
 * Utility functions for price calculation
 */

/**
 * Tính tổng giá phòng
 * Công thức: pricePerNight × số đêm × số người
 *
 * @param {number} pricePerNight - Giá mỗi đêm
 * @param {number} nights - Số đêm
 * @param {number} persons - Số người
 * @returns {number} Tổng tiền
 */
export const calculateTotalPrice = (pricePerNight, nights, persons) => {
  if (!pricePerNight || !nights || !persons) return 0;
  return pricePerNight * nights * persons;
};

/**
 * Format số tiền thành chuỗi hiển thị
 * @param {number} amount
 * @param {string} currency - Ký hiệu tiền tệ, mặc định "$"
 * @returns {string}
 */
export const formatPrice = (amount, currency = "$") => {
  if (!amount && amount !== 0) return `${currency}0`;
  return `${currency}${amount.toLocaleString("en-US")}`;
};
