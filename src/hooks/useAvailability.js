import { useState, useCallback } from "react";
import axios from "axios";

/**
 * Custom hook để kiểm tra availability của phòng
 * và lấy danh sách ngày đã được đặt
 */
const useAvailability = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);

  /**
   * Lấy danh sách khoảng ngày đã đặt của 1 phòng
   * @param {string} roomId
   */
  const fetchBookedDates = useCallback(async (roomId) => {
    if (!roomId) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/bookings/booked-dates/${roomId}`);
      if (data.success) {
        setBookedRanges(
          data.bookings.map((b) => ({
            startDate: new Date(b.checkIn),
            endDate: new Date(b.checkOut),
            status: b.status,
          }))
        );
      }
    } catch (error) {
      console.error("fetchBookedDates error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Kiểm tra xem khoảng ngày có available không
   * @param {string} roomId
   * @param {string} checkInDate - YYYY-MM-DD
   * @param {string} checkOutDate - YYYY-MM-DD
   * @returns {Promise<boolean>}
   */
  const checkAvailability = useCallback(
    async (roomId, checkInDate, checkOutDate) => {
      if (!roomId || !checkInDate || !checkOutDate) return false;
      setIsLoading(true);
      try {
        const { data } = await axios.post("/api/bookings/check-availability", {
          room: roomId,
          checkInDate,
          checkOutDate,
        });
        return data.isAvailable === true;
      } catch (error) {
        console.error("checkAvailability error:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Kiểm tra ngay trên client-side (nhanh hơn, không cần gọi API)
   * so sánh với bookedRanges đã fetch
   * @param {Date} checkIn
   * @param {Date} checkOut
   * @returns {boolean}
   */
  const isDateRangeAvailable = useCallback(
    (checkIn, checkOut) => {
      if (!checkIn || !checkOut || bookedRanges.length === 0) return true;
      return !bookedRanges.some(
        (range) => checkIn < range.endDate && checkOut > range.startDate
      );
    },
    [bookedRanges]
  );

  return {
    isLoading,
    bookedRanges,
    fetchBookedDates,
    checkAvailability,
    isDateRangeAvailable,
  };
};

export default useAvailability;
