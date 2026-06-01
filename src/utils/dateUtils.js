/**
 * Utility functions for date handling
 */

/**
 * Format date to DD/MM/YYYY
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format date to "DD Tháng MM, YYYY"
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateLong = (date) => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Calculate number of nights between two dates
 * @param {Date|string} checkIn
 * @param {Date|string} checkOut
 * @returns {number} số đêm (tối thiểu 1)
 */
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end.getTime() - start.getTime();
  const nights = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(nights, 0);
};

/**
 * Get today's date as YYYY-MM-DD string (for input min attribute)
 * @returns {string}
 */
export const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Convert Date to YYYY-MM-DD string for input fields
 * @param {Date} date
 * @returns {string}
 */
export const toInputDateString = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

/**
 * Check if two date ranges overlap
 * @param {Date} start1
 * @param {Date} end1
 * @param {Date} start2
 * @param {Date} end2
 * @returns {boolean}
 */
export const datesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && end1 > start2;
};

/**
 * Build an array of Date objects for all days in a booked range [checkIn, checkOut)
 * @param {Date} checkIn
 * @param {Date} checkOut
 * @returns {Date[]}
 */
export const getDateRangeArray = (checkIn, checkOut) => {
  const dates = [];
  const current = new Date(checkIn);
  const end = new Date(checkOut);

  while (current < end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};
