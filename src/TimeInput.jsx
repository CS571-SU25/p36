import React, { useEffect } from "react";
import { Form } from "react-bootstrap";

/**
 * TimeInput component lets user enter date and time in EST (24-hour),
 * then converts it to UTC ISO string and passes it back via onUtcTimeChange.
 *
 * Props:
 * - date: EST date string "YYYY-MM-DD"
 * - time: EST time string "HH:mm"
 * - onDateChange: function(newDate)
 * - onTimeChange: function(newTime)
 * - onUtcTimeChange: function(utcISOString)
 */

function TimeInput({ date, time, onDateChange, onTimeChange, onUtcTimeChange }) {
  // Convert EST date/time to UTC ISO string
  function convertESTtoUTC(dateStr, timeStr) {
    if (!dateStr || !timeStr) return "";

    const [hour, minute] = timeStr.split(":").map(Number);

    // Parse EST components as UTC components offset by 5 hours
    // Create a Date object in UTC by manually building date components
    // EST is UTC-5, so when converting EST → UTC, subtract 5 hours from UTC

    // Build a Date in UTC:
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(5, 7)) - 1; // 0-based month
    const day = parseInt(dateStr.slice(8, 10));

    // EST time is 5 hours behind UTC → add 5 hours to EST to get UTC
    // But since we want a UTC Date object, add 5 hours to the hour

    // Construct date in UTC by adding 5 hours
    const utcDate = new Date(Date.UTC(year, month, day, hour + 5, minute));

    return utcDate.toISOString();
    }


  useEffect(() => {
    if (date && time && onUtcTimeChange) {
      const utcString = convertESTtoUTC(date, time);
      onUtcTimeChange(utcString);
    }
  }, [date, time, onUtcTimeChange]);

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Select Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Select Time (24-hour)</Form.Label>
        <Form.Control
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          step="60"
        />
      </Form.Group>
    </>
  );
}

export default TimeInput;
