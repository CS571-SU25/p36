import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

/**
 * TimeInput component lets user enter date and time in EST (24-hour),
 * then converts it to UTC ISO string and passes it back via onUtcTimeChange.
 *
 * Props:
 * - onUtcTimeChange: function(utcISOString) called whenever inputs change and produce a valid UTC time.
 */
function TimeInput({ onUtcTimeChange }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function convertESTtoUTC(dateStr, timeStr) {
    if (!dateStr || !timeStr) return "";

    const [hour, minute] = timeStr.split(":").map(Number);

    // Build a UTC Date object with the EST date/time components
    const dateUTC = new Date(Date.UTC(
      parseInt(dateStr.slice(0, 4)),
      parseInt(dateStr.slice(5, 7)) - 1,
      parseInt(dateStr.slice(8, 10)),
      hour,
      minute
    ));

    // EST is UTC-5, so add 5 hours to convert to UTC
    dateUTC.setUTCHours(dateUTC.getUTCHours() + 5);

    return dateUTC.toISOString();
  }

  useEffect(() => {
    const utcString = convertESTtoUTC(date, time);
    if (onUtcTimeChange) {
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
          onChange={(e) => setDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Select Time (24-hour)</Form.Label>
        <Form.Control
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          step="60"
        />
      </Form.Group>
    </>
  );
}

export default TimeInput;
