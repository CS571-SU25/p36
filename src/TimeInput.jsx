import React, { useEffect } from "react";
import { Form } from "react-bootstrap";

/**
 * TimeInput lets user select EST date and time,
 * converts those inputs to UTC ISO string,
 * then calls onUtcTimeChange with the UTC string.
 *
 * Props:
 * - date: EST date string ("YYYY-MM-DD")
 * - time: EST time string ("HH:mm")
 * - onDateChange: callback(newDate)
 * - onTimeChange: callback(newTime)
 * - onUtcTimeChange: callback(utcISOString)
 */
function TimeInput({ date, time, onDateChange, onTimeChange, onUtcTimeChange }) {
  // Convert EST date/time to UTC ISO string
  function convertESTtoUTC(dateStr, timeStr) {
    if (!dateStr || !timeStr) return "";

    const [hour, minute] = timeStr.split(":").map(Number);

    // Parse date parts
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(5, 7)) - 1; // zero-based month
    const day = parseInt(dateStr.slice(8, 10));

    // EST is UTC-5 → add 5 hours to get UTC
    const utcDate = new Date(Date.UTC(year, month, day, hour + 5, minute));

    return utcDate.toISOString();
  }

  // When date or time changes, convert to UTC and notify parent
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
