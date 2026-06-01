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
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
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
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import AvailabilityCalendar from "./AvailabilityCalendar";
import useAvailability from "../../hooks/useAvailability";
import { calculateNights, formatDate } from "../../utils/dateUtils";
import { calculateTotalPrice, formatPrice } from "../../utils/priceUtils";

// ─── Promo Codes ──────────────────────────────────────────────────────────────
const VALID_PROMO_CODES = {
  WELCOME10: { discount: 10, type: "percent", label: "10% off for new guests" },
  SAVE20: { discount: 20, type: "percent", label: "20% off your stay" },
  FLAT50: { discount: 50, type: "fixed", label: "$50 off" },
  SUMMER15: { discount: 15, type: "percent", label: "15% summer discount" },
};

// ─── Room Extras ───────────────────────────────────────────────────────────────
const ROOM_EXTRAS = [
  { id: "breakfast", label: "Breakfast Included", price: 15, icon: "🍳", per: "per person/night" },
  { id: "airport", label: "Airport Transfer", price: 35, icon: "✈️", per: "per trip" },
  { id: "spa", label: "Spa Access", price: 25, icon: "💆", per: "per person/day" },
  { id: "parking", label: "Private Parking", price: 20, icon: "🚗", per: "per night" },
  { id: "latecheckout", label: "Late Check-out (2pm)", price: 30, icon: "⏰", per: "one-time" },
  { id: "minibar", label: "Minibar Restocked Daily", price: 18, icon: "🥂", per: "per night" },
];

const BookingForm = ({ room }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AppContext);

  const [showCalendar, setShowCalendar] = useState(false);
  const [persons, setPersons] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Pay At Hotel");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);

  // Date range
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);

  // Promo code
  const [promoCode, setPromoCode] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoData, setPromoData] = useState(null);
  const [promoError, setPromoError] = useState("");

  // Special request
  const [specialRequest, setSpecialRequest] = useState("");

  // Room extras
  const [selectedExtras, setSelectedExtras] = useState([]);

  // Guest info
  const [guestInfo, setGuestInfo] = useState({ name: "", phone: "" });

  const { bookedRanges, fetchBookedDates, isDateRangeAvailable } = useAvailability();

  useEffect(() => {
    if (room?._id) fetchBookedDates(room._id);
  }, [room?._id, fetchBookedDates]);

  const checkIn = dateRange[0].startDate;
  const checkOut = dateRange[0].endDate;
  const nights = calculateNights(checkIn, checkOut);
  const basePrice = calculateTotalPrice(room?.pricePerNight, nights, persons);

  // Calculate extras total
  const extrasTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = ROOM_EXTRAS.find((e) => e.id === extraId);
    if (!extra) return sum;
    // Per-night extras multiply by nights
    const multiply =
      extra.per.includes("night") || extra.per.includes("day") || extra.per.includes("person")
        ? nights || 1
        : 1;
    return sum + extra.price * multiply;
  }, 0);

  // Apply promo discount
  const subtotal = basePrice + extrasTotal;
  let discountAmount = 0;
  if (promoData) {
    if (promoData.type === "percent") {
      discountAmount = Math.round((subtotal * promoData.discount) / 100);
    } else {
      discountAmount = Math.min(promoData.discount, subtotal);
    }
  }
  const totalPrice = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    if (checkIn && checkOut && checkIn < checkOut) {
      setAvailabilityStatus(isDateRangeAvailable(checkIn, checkOut));
    } else {
      setAvailabilityStatus(null);
    }
  }, [checkIn, checkOut, isDateRangeAvailable]);

  const handleDateChange = (ranges) => setDateRange([ranges.selection]);
  const handlePersonChange = (delta) =>
    setPersons((prev) => Math.max(1, Math.min(10, prev + delta)));

  const handleToggleExtra = (extraId) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const found = VALID_PROMO_CODES[code];
    if (found) {
      setPromoData(found);
      setPromoCode(code);
      setPromoError("");
      toast.success(`🎉 Promo code applied: ${found.label}`);
    } else {
      setPromoData(null);
      setPromoCode("");
      setPromoError("Invalid promo code. Try: WELCOME10, SAVE20, FLAT50, SUMMER15");
    }
  };

  const handleRemovePromo = () => {
    setPromoData(null);
    setPromoCode("");
    setPromoInput("");
    setPromoError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to book a room!");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates!");
      setShowCalendar(true);
      return;
    }

    if (checkIn >= checkOut) {
      toast.error("Check-out date must be after check-in date!");
      return;
    }

    if (availabilityStatus === false) {
      toast.error("Room is already booked for the selected dates!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Server-side availability check
      const { data: checkData } = await axios.post("/api/bookings/check-availability", {
        room: room._id,
        checkInDate: checkIn.toISOString().split("T")[0],
        checkOutDate: checkOut.toISOString().split("T")[0],
      });

      if (!checkData.success || !checkData.isAvailable) {
        toast.error("Room is already booked! Please choose different dates.");
        setAvailabilityStatus(false);
        fetchBookedDates(room._id);
        return;
      }

      const { data } = await axios.post("/api/bookings/book", {
        room: room._id,
        checkInDate: checkIn.toISOString().split("T")[0],
        checkOutDate: checkOut.toISOString().split("T")[0],
        persons,
        paymentMethod,
        // Extended fields (stored as metadata)
        specialRequest: specialRequest || undefined,
        extras: selectedExtras.length ? selectedExtras : undefined,
        promoCode: promoCode || undefined,
        discountAmount: discountAmount || undefined,
        guestName: guestInfo.name || undefined,
        guestPhone: guestInfo.phone || undefined,
      });

      if (data.success) {
        toast.success("🎉 Room booked successfully!");
        navigate("/my-bookings");
        window.scrollTo(0, 0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Booking failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidDates = checkIn && checkOut && checkIn < checkOut;

  // Shared accordion style
  const accordionSx = {
    border: "1px solid #e5e7eb",
    borderRadius: "12px !important",
    boxShadow: "none",
    "&:before": { display: "none" },
    "&.Mui-expanded": { margin: 0 },
  };

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
      {/* ── Header ── */}
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
            Book Room
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="baseline" spacing={0.5}>
          <Typography variant="h4" fontWeight="900">
            {formatPrice(room?.pricePerNight)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            / night / guest
          </Typography>
        </Stack>
      </Box>

      <Box p={3}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* ── Date Picker ── */}
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
                  : "Select check-in / check-out dates"}
              </Button>

              {hasValidDates && availabilityStatus !== null && (
                <Box mt={1}>
                  <Chip
                    icon={availabilityStatus ? <CheckCircleOutlineIcon /> : undefined}
                    label={
                      availabilityStatus
                        ? "✅ Room is available!"
                        : "❌ Room is already booked for these dates"
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
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                {[
                  { label: "CHECK-IN", date: checkIn },
                  { label: "CHECK-OUT", date: checkOut },
                ].map(({ label, date }) => (
                  <Box
                    key={label}
                    sx={{ p: 1.5, borderRadius: 2, bgcolor: "#eff6ff", border: "1px solid #bfdbfe" }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                      {label}
                    </Typography>
                    <Typography variant="body2" fontWeight="700" color="#1d4ed8">
                      {formatDate(date)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Divider />

            {/* ── Guests Counter ── */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <PeopleIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                <Typography variant="body1" fontWeight={600}>
                  Guests
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => handlePersonChange(-1)}
                  disabled={persons <= 1}
                  sx={{ border: "1px solid #e5e7eb", width: 32, height: 32, "&:hover": { bgcolor: "#fee2e2" } }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" fontWeight="700" minWidth={28} textAlign="center">
                  {persons}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handlePersonChange(1)}
                  disabled={persons >= 10}
                  sx={{ border: "1px solid #e5e7eb", width: 32, height: 32, "&:hover": { bgcolor: "#dcfce7" } }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>

            {/* ── Payment Method ── */}
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <PaymentIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                <Typography variant="body1" fontWeight={600}>
                  Payment Method
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                {["Pay At Hotel", "Stripe"].map((method) => (
                  <Chip
                    key={method}
                    label={method === "Pay At Hotel" ? "🏨 Pay at Hotel" : "💳 Pay Online"}
                    clickable
                    color={paymentMethod === method ? "primary" : "default"}
                    variant={paymentMethod === method ? "filled" : "outlined"}
                    onClick={() => setPaymentMethod(method)}
                    sx={{ flex: 1, fontWeight: paymentMethod === method ? 700 : 400, py: 2.5, fontSize: "0.75rem" }}
                  />
                ))}
              </Stack>
            </Box>

            <Divider />

            {/* ── Guest Info ── */}
            <Accordion sx={accordionSx} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PersonIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                  <Typography variant="body1" fontWeight={600}>
                    Guest Information
                  </Typography>
                  {(guestInfo.name || guestInfo.phone) && (
                    <Chip label="Filled" size="small" color="success" sx={{ fontSize: "0.65rem", height: 18 }} />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Full Name"
                    placeholder="e.g. John Smith"
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Phone Number"
                    placeholder="e.g. +1 234 567 8900"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* ── Room Extras ── */}
            <Accordion sx={accordionSx} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <RoomServiceIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                  <Typography variant="body1" fontWeight={600}>
                    Add-on Services
                  </Typography>
                  {selectedExtras.length > 0 && (
                    <Chip
                      label={`${selectedExtras.length} selected`}
                      size="small"
                      color="primary"
                      sx={{ fontSize: "0.65rem", height: 18 }}
                    />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Stack spacing={1}>
                  {ROOM_EXTRAS.map((extra) => {
                    const isSelected = selectedExtras.includes(extra.id);
                    return (
                      <Box
                        key={extra.id}
                        onClick={() => handleToggleExtra(extra.id)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1.5,
                          borderRadius: 2,
                          border: `1.5px solid ${isSelected ? "#3b82f6" : "#e5e7eb"}`,
                          bgcolor: isSelected ? "#eff6ff" : "white",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          "&:hover": { borderColor: "#3b82f6", bgcolor: "#f5f8ff" },
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Typography fontSize={20}>{extra.icon}</Typography>
                          <Box>
                            <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                              {extra.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              +{formatPrice(extra.price)} {extra.per}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            border: `2px solid ${isSelected ? "#3b82f6" : "#d1d5db"}`,
                            bgcolor: isSelected ? "#3b82f6" : "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isSelected && <CheckIcon sx={{ fontSize: 13, color: "white" }} />}
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* ── Special Request ── */}
            <Accordion sx={accordionSx} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <NoteAltIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                  <Typography variant="body1" fontWeight={600}>
                    Special Requests
                  </Typography>
                  {specialRequest && (
                    <Chip label="Added" size="small" color="info" sx={{ fontSize: "0.65rem", height: 18 }} />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  placeholder="e.g. High floor, non-smoking room, early check-in, anniversary decoration..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  inputProps={{ maxLength: 500 }}
                  helperText={`${specialRequest.length}/500 characters`}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </AccordionDetails>
            </Accordion>

            {/* ── Promo Code ── */}
            <Accordion sx={accordionSx} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocalOfferIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                  <Typography variant="body1" fontWeight={600}>
                    Promo Code
                  </Typography>
                  {promoData && (
                    <Chip
                      label={`-${promoData.type === "percent" ? promoData.discount + "%" : formatPrice(promoData.discount)}`}
                      size="small"
                      color="success"
                      sx={{ fontSize: "0.65rem", height: 18, fontWeight: 700 }}
                    />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                {promoData ? (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#f0fdf4",
                      border: "1.5px solid #86efac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CheckCircleOutlineIcon sx={{ color: "#22c55e", fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#15803d">
                          {promoCode}
                        </Typography>
                        <Typography variant="caption" color="#16a34a">
                          {promoData.label}
                        </Typography>
                      </Box>
                    </Stack>
                    <Button size="small" color="error" onClick={handleRemovePromo} sx={{ minWidth: 0 }}>
                      Remove
                    </Button>
                  </Box>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter promo code"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                      error={!!promoError}
                      helperText={promoError || "Try: WELCOME10, SAVE20, FLAT50, SUMMER15"}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyPromo())}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleApplyPromo}
                      sx={{ borderRadius: 2, px: 2.5, whiteSpace: "nowrap", flexShrink: 0 }}
                    >
                      Apply
                    </Button>
                  </Stack>
                )}
              </AccordionDetails>
            </Accordion>

            <Divider />

            {/* ── Price Summary ── */}
            {hasValidDates ? (
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f8faff", border: "1px solid #e8eaf6" }}>
                <Stack spacing={1}>
                  {/* Base price */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(room?.pricePerNight)} × {nights} night{nights > 1 ? "s" : ""} × {persons} guest{persons > 1 ? "s" : ""}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatPrice(basePrice)}
                    </Typography>
                  </Stack>

                  {/* Night stay label */}
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <NightsStayIcon sx={{ fontSize: 16, color: "#6b7280" }} />
                    <Typography variant="caption" color="text.secondary">
                      {nights} night{nights > 1 ? "s" : ""} stay
                    </Typography>
                  </Stack>

                  {/* Extras */}
                  {selectedExtras.length > 0 && (
                    <>
                      <Divider sx={{ borderStyle: "dashed" }} />
                      {selectedExtras.map((extraId) => {
                        const extra = ROOM_EXTRAS.find((e) => e.id === extraId);
                        if (!extra) return null;
                        const multiply =
                          extra.per.includes("night") || extra.per.includes("day") || extra.per.includes("person")
                            ? nights || 1
                            : 1;
                        return (
                          <Stack key={extraId} direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              {extra.icon} {extra.label}
                            </Typography>
                            <Typography variant="body2" color="#6b7280">
                              +{formatPrice(extra.price * multiply)}
                            </Typography>
                          </Stack>
                        );
                      })}
                    </>
                  )}

                  {/* Promo discount */}
                  {promoData && discountAmount > 0 && (
                    <>
                      <Divider sx={{ borderStyle: "dashed" }} />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="#16a34a" fontWeight={600}>
                          🏷️ Promo: {promoCode}
                        </Typography>
                        <Typography variant="body2" color="#16a34a" fontWeight={700}>
                          −{formatPrice(discountAmount)}
                        </Typography>
                      </Stack>
                    </>
                  )}

                  <Divider />

                  {/* Total */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight="700">
                      Total
                    </Typography>
                    <Stack alignItems="flex-end">
                      <Typography variant="h5" fontWeight="900" color="#2563eb" lineHeight={1}>
                        {formatPrice(totalPrice)}
                      </Typography>
                      {promoData && (
                        <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                          {formatPrice(subtotal)}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Please select dates to see the total price
              </Alert>
            )}

            {/* ── Submit Button ── */}
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
                "&.Mui-disabled": { bgcolor: "#e5e7eb", color: "#9ca3af" },
              }}
            >
              {isSubmitting ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Processing...</span>
                </Stack>
              ) : !room?.isAvailable ? (
                "Room Not Available"
              ) : availabilityStatus === false ? (
                "Already Booked — Choose Different Dates"
              ) : !user ? (
                "🔐 Login to Book"
              ) : (
                "🏨 Book Now"
              )}
            </Button>

            {/* Guarantee note */}
            <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
              🔒 Secure &amp; safe. Free cancellation up to 24h before check-in.
            </Typography>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default BookingForm;