import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { addDays, isBefore, startOfDay } from "date-fns";
import { Box, Typography, Stack, Chip } from "@mui/material";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./AvailabilityCalendar.css";

/**
 * AvailabilityCalendar - Hiển thị lịch với ngày đã bị đặt (đỏ)
 * và cho phép người dùng chọn khoảng ngày trống
 *
 * @param {Object[]} bookedRanges  - Mảng {startDate, endDate} đã bị đặt
 * @param {Object}   selection     - { startDate, endDate, key }
 * @param {Function} onChange      - Callback khi người dùng thay đổi lựa chọn
 */
const AvailabilityCalendar = ({ bookedRanges = [], selection, onChange }) => {
  const today = startOfDay(new Date());

  // Tập hợp tất cả ngày bị block để disable
  const getDisabledDates = () => {
    const disabled = [];
    bookedRanges.forEach(({ startDate, endDate }) => {
      const current = new Date(startDate);
      const end = new Date(endDate);
      while (current < end) {
        disabled.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return disabled;
  };

  const disabledDates = getDisabledDates();

  // Custom day renderer để tô màu ngày blocked
  const customDayContent = (day) => {
    const dayStart = startOfDay(day);
    const isBooked = bookedRanges.some(({ startDate, endDate }) => {
      const start = startOfDay(new Date(startDate));
      const end = startOfDay(new Date(endDate));
      return dayStart >= start && dayStart < end;
    });

    const isPast = isBefore(dayStart, today);

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          position: "relative",
          borderRadius: "50%",
          backgroundColor: isBooked
            ? "rgba(239, 68, 68, 0.15)"
            : "transparent",
        }}
      >
        <span
          style={{
            color: isBooked ? "#ef4444" : isPast ? "#d1d5db" : "inherit",
            fontWeight: isBooked ? "600" : "normal",
          }}
        >
          {day.getDate()}
        </span>
        {isBooked && (
          <Box
            sx={{
              position: "absolute",
              bottom: 2,
              width: 4,
              height: 4,
              borderRadius: "50%",
              bgcolor: "#ef4444",
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Legend */}
      <Stack
        direction="row"
        spacing={2}
        mb={2}
        flexWrap="wrap"
        useFlexGap
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: "#3b82f6",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Selected dates
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: "#ef4444",
              opacity: 0.7,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Already booked
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: "#e5e7eb",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Available
          </Typography>
        </Stack>
      </Stack>

      {/* Calendar */}
      <Box
        sx={{
          "& .rdrCalendarWrapper": {
            width: "100%",
            fontSize: "13px",
          },
          "& .rdrMonth": {
            width: "100%",
          },
          "& .rdrDateDisplayWrapper": {
            display: "none", // Ẩn thanh hiển thị date vì BookingForm đã có
          },
          "& .rdrDayDisabled": {
            backgroundColor: "rgba(239, 68, 68, 0.08) !important",
            "& .rdrDayNumber span": {
              color: "#ef4444 !important",
              textDecoration: "line-through",
            },
          },
          "& .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span, & .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span":
            {
              color: "#fff !important",
            },
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <DateRange
          ranges={[selection]}
          onChange={onChange}
          months={1}
          direction="horizontal"
          minDate={today}
          disabledDates={disabledDates}
          dayContentRenderer={customDayContent}
          rangeColors={["#3b82f6"]}
          showMonthAndYearPickers={true}
          showDateDisplay={false}
          moveRangeOnFirstSelection={false}
        />
      </Box>

      {bookedRanges.length > 0 && (
        <Box mt={1.5}>
          <Typography variant="caption" color="text.secondary">
            🔒 {bookedRanges.length} booked period{bookedRanges.length > 1 ? 's' : ''}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AvailabilityCalendar;
