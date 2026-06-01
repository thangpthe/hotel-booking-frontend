import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  Collapse,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import PaymentIcon from "@mui/icons-material/Payment";
import HotelIcon from "@mui/icons-material/Hotel";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import AvailabilityCalendar from "./AvailabilityCalendar";
import useAvailability from "../../hooks/useAvailability";
import { calculateNights, formatDate } from "../../utils/dateUtils";
import { calculateTotalPrice, formatPrice } from "../../utils/priceUtils";

const BookingForm = ({ room }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AppContext);

  const [showCalendar, setShowCalendar] = useState(false);
  const [persons, setPersons] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Pay At Hotel");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // null | true | false

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const { bookedRanges, fetchBookedDates, isDateRangeAvailable } =
    useAvailability();

  // Fetch ngày đã đặt khi load
  useEffect(() => {
    if (room?._id) {
      fetchBookedDates(room._id);
    }
  }, [room?._id, fetchBookedDates]);

  const checkIn = dateRange[0].startDate;
  const checkOut = dateRange[0].endDate;
  const nights = calculateNights(checkIn, checkOut);
  const totalPrice = calculateTotalPrice(room?.pricePerNight, nights, persons);

  // Kiểm tra availability client-side ngay khi chọn ngày
  useEffect(() => {
    if (checkIn && checkOut && checkIn < checkOut) {
      const available = isDateRangeAvailable(checkIn, checkOut);
      setAvailabilityStatus(available);
    } else {
      setAvailabilityStatus(null);
    }
  }, [checkIn, checkOut, isDateRangeAvailable]);

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handlePersonChange = (delta) => {
    setPersons((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt phòng!");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Vui lòng chọn ngày check-in và check-out!");
      setShowCalendar(true);
      return;
    }

    if (checkIn >= checkOut) {
      toast.error("Ngày check-out phải sau ngày check-in!");
      return;
    }

    if (availabilityStatus === false) {
      toast.error("Phòng đã có người đặt trong khoảng thời gian này!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Double-check với server
      const { data: checkData } = await axios.post(
        "/api/bookings/check-availability",
        {
          room: room._id,
          checkInDate: checkIn.toISOString().split("T")[0],
          checkOutDate: checkOut.toISOString().split("T")[0],
        }
      );

      if (!checkData.success || !checkData.isAvailable) {
        toast.error("Phòng đã có người đặt! Vui lòng chọn ngày khác.");
        setAvailabilityStatus(false);
        // Refresh booked dates
        fetchBookedDates(room._id);
        return;
      }

      // Tiến hành đặt phòng
      const { data } = await axios.post("/api/bookings/book", {
        room: room._id,
        checkInDate: checkIn.toISOString().split("T")[0],
        checkOutDate: checkOut.toISOString().split("T")[0],
        persons,
        paymentMethod,
      });

      if (data.success) {
        toast.success("🎉 Đặt phòng thành công!");
        navigate("/my-bookings");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Đặt phòng thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidDates = checkIn && checkOut && checkIn < checkOut;

  return (
    <Box
      mt={4}
      mb={4}
      borderRadius={3}
      sx={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
        border: "1px solid #e8eaf6",
        boxShadow: "0 8px 32px rgba(59, 130, 246, 0.12)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
          p: 3,
          color: "white",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
          <HotelIcon sx={{ fontSize: 24 }} />
          <Typography variant="h5" fontWeight="800" letterSpacing={-0.5}>
            Đặt Phòng
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="baseline" spacing={0.5}>
          <Typography variant="h4" fontWeight="900">
            {formatPrice(room?.pricePerNight)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            / đêm / người
          </Typography>
        </Stack>
      </Box>

      <Box p={3}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Date Picker Toggle */}
            <Box>
              <Button
                fullWidth
                variant={showCalendar ? "contained" : "outlined"}
                startIcon={<CalendarMonthIcon />}
                onClick={() => setShowCalendar((v) => !v)}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderColor: "#3b82f6",
                  color: showCalendar ? "white" : "#3b82f6",
                  bgcolor: showCalendar ? "#3b82f6" : "transparent",
                  "&:hover": {
                    bgcolor: showCalendar ? "#2563eb" : "rgba(59,130,246,0.05)",
                  },
                }}
              >
                {hasValidDates
                  ? `${formatDate(checkIn)} → ${formatDate(checkOut)}`
                  : "Chọn ngày check-in / check-out"}
              </Button>

              {/* Availability status badge */}
              {hasValidDates && availabilityStatus !== null && (
                <Box mt={1}>
                  <Chip
                    icon={
                      availabilityStatus ? (
                        <CheckCircleOutlineIcon />
                      ) : undefined
                    }
                    label={
                      availabilityStatus
                        ? "✅ Phòng trống, có thể đặt!"
                        : "❌ Phòng đã được đặt trong khoảng này"
                    }
                    color={availabilityStatus ? "success" : "error"}
                    size="small"
                    variant="filled"
                    sx={{ width: "100%", py: 0.5, fontWeight: 600 }}
                  />
                </Box>
              )}
            </Box>

            {/* Calendar */}
            <Collapse in={showCalendar}>
              <Box
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  overflow: "hidden",
                  p: 2,
                  bgcolor: "#fafbff",
                }}
              >
                <AvailabilityCalendar
                  bookedRanges={bookedRanges}
                  selection={dateRange[0]}
                  onChange={handleDateChange}
                />
              </Box>
            </Collapse>

            {/* Date Summary */}
            {hasValidDates && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#eff6ff",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    fontWeight={600}
                  >
                    CHECK-IN
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#1d4ed8">
                    {formatDate(checkIn)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#eff6ff",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    fontWeight={600}
                  >
                    CHECK-OUT
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#1d4ed8">
                    {formatDate(checkOut)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Divider />

            {/* Persons Counter */}
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PeopleIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                  <Typography variant="body1" fontWeight={600}>
                    Số khách
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => handlePersonChange(-1)}
                    disabled={persons <= 1}
                    sx={{
                      border: "1px solid #e5e7eb",
                      width: 32,
                      height: 32,
                      "&:hover": { bgcolor: "#fee2e2" },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    minWidth={28}
                    textAlign="center"
                  >
                    {persons}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handlePersonChange(1)}
                    disabled={persons >= 10}
                    sx={{
                      border: "1px solid #e5e7eb",
                      width: 32,
                      height: 32,
                      "&:hover": { bgcolor: "#dcfce7" },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>

            {/* Payment Method */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <PaymentIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                <Typography variant="body1" fontWeight={600}>
                  Phương thức thanh toán
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                {["Pay At Hotel", "Stripe"].map((method) => (
                  <Chip
                    key={method}
                    label={method === "Pay At Hotel" ? "🏨 Tại khách sạn" : "💳 Thanh toán online"}
                    clickable
                    color={paymentMethod === method ? "primary" : "default"}
                    variant={paymentMethod === method ? "filled" : "outlined"}
                    onClick={() => setPaymentMethod(method)}
                    sx={{
                      flex: 1,
                      fontWeight: paymentMethod === method ? 700 : 400,
                      py: 2.5,
                      fontSize: "0.75rem",
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* Price Summary */}
            {hasValidDates && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#f8faff",
                  border: "1px solid #e8eaf6",
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(room?.pricePerNight)} × {nights} đêm × {persons} khách
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatPrice(totalPrice)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <NightsStayIcon sx={{ fontSize: 16, color: "#6b7280" }} />
                    <Typography variant="caption" color="text.secondary">
                      {nights} đêm lưu trú
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight="700">
                      Tổng cộng
                    </Typography>
                    <Typography variant="h5" fontWeight="900" color="#2563eb">
                      {formatPrice(totalPrice)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            )}

            {/* Alert nếu chưa chọn ngày */}
            {!hasValidDates && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Vui lòng chọn ngày để xem tổng giá
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              variant="contained"
              type="submit"
              fullWidth
              size="large"
              disabled={!room?.isAvailable || isSubmitting || availabilityStatus === false}
              sx={{
                py: 2,
                fontWeight: "800",
                fontSize: "1rem",
                borderRadius: 2,
                background:
                  room?.isAvailable && availabilityStatus !== false
                    ? "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)"
                    : undefined,
                "&:not(.Mui-disabled):hover": {
                  background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 25px rgba(37, 99, 235, 0.4)",
                },
                transition: "all 0.2s ease",
                "&.Mui-disabled": {
                  bgcolor: "#e5e7eb",
                  color: "#9ca3af",
                },
              }}
            >
              {isSubmitting ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Đang xử lý...</span>
                </Stack>
              ) : !room?.isAvailable ? (
                "Phòng hiện không khả dụng"
              ) : availabilityStatus === false ? (
                "Đã có người đặt - Chọn ngày khác"
              ) : !user ? (
                "🔐 Đăng nhập để đặt phòng"
              ) : (
                "🏨 Đặt Phòng Ngay"
              )}
            </Button>

            {/* Guarantee note */}
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              display="block"
            >
              🔒 Thông tin an toàn & bảo mật. Hủy miễn phí trước 24h check-in.
            </Typography>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default BookingForm;