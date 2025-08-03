import { useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import NavBar from "./NavBar";
import ImageDisplay from "./ImageDisplay";
import TimeInput from "./TimeInput";

/**
 * Converts a UTC ISO string into EST date and time strings.
 * EST is UTC minus 5 hours.
 * Returns an object: { date: "YYYY-MM-DD", time: "HH:mm" }.
 */
function utcToEstDateTime(utcISOString) {
  if (!utcISOString) return { date: "", time: "" };

  const utcDate = new Date(utcISOString);

  // Subtract 5 hours in milliseconds to convert UTC to EST
  const estDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);

  // Use UTC getters to get components (avoid local timezone issues)
  const year = estDate.getUTCFullYear();
  const month = (estDate.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = estDate.getUTCDate().toString().padStart(2, "0");

  const hours = estDate.getUTCHours().toString().padStart(2, "0");
  const minutes = estDate.getUTCMinutes().toString().padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  };
}

function EarthImageViewer() {
  // Refs to input fields for coordinates (min/max latitude and longitude)
  const minLatitudeRef = useRef();
  const minLongitudeRef = useRef();
  const maxLatitudeRef = useRef();
  const maxLongitudeRef = useRef();

  // State for image URL and alt text shown in the image display
  const [imageURL, setImageURL] = useState();
  const [altText, setAltText] = useState("");

  // EST date and time inputs
  const [estDate, setEstDate] = useState("");
  const [estTime, setEstTime] = useState("");

  // UTC time string used for the API call
  const [utcTime, setUtcTime] = useState("");

  // On mount: load any stored coordinates and time from sessionStorage (e.g., from NaturalEventsTracker)
  useEffect(() => {
    const minLat = sessionStorage.getItem("minLat");
    const maxLat = sessionStorage.getItem("maxLat");
    const minLon = sessionStorage.getItem("minLon");
    const maxLon = sessionStorage.getItem("maxLon");
    const time = sessionStorage.getItem("time");

    if (minLat && maxLat && minLon && maxLon && time) {
      // Set input values to loaded coordinates
      minLatitudeRef.current.value = minLat;
      maxLatitudeRef.current.value = maxLat;
      minLongitudeRef.current.value = minLon;
      maxLongitudeRef.current.value = maxLon;

      // Convert UTC time to EST for display in inputs
      const { date, time: t } = utcToEstDateTime(time);
      setEstDate(date);
      setEstTime(t);

      // Set the UTC time state used for the API call
      setUtcTime(time);

      // Clear sessionStorage to avoid stale data
      sessionStorage.removeItem("minLat");
      sessionStorage.removeItem("maxLat");
      sessionStorage.removeItem("minLon");
      sessionStorage.removeItem("maxLon");
      sessionStorage.removeItem("time");
    }
  }, []);

  // Callback to update UTC time from TimeInput component
  function handleUtcTimeChange(newUtc) {
    setUtcTime(newUtc);
  }

  // Fetch satellite image from NASA API and update image URL and alt text
  function displayImage() {
    if (!utcTime) {
      alert("Please enter a valid EST time.");
      return;
    }

    fetch(
      `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/png&TRANSPARENT=TRUE&HEIGHT=512&WIDTH=512&CRS=EPSG:4326&BBOX=${minLatitudeRef.current.value},${minLongitudeRef.current.value},${maxLatitudeRef.current.value},${maxLongitudeRef.current.value}&TIME=${utcTime}`
    )
      .then((res) => res.blob())
      .then((blob) => {
        // Create a blob URL for the fetched image
        setImageURL(URL.createObjectURL(blob));
        setAltText(`Satellite image of Earth taken on ${utcTime}`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div>
      <h1 className="page-title">Earth Image Viewer</h1>
      <NavBar />
      <br />

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 180px)",
          gap: "2rem",
        }}
      >
        {/* Left side: coordinate and time input form */}
        <div
          style={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 2rem",
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h4>Enter Coordinates</h4>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Latitude - Image's South Edge.</Form.Label>
              <Form.Control ref={minLatitudeRef} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Minimum Longitude - Image's West Edge.</Form.Label>
              <Form.Control ref={minLongitudeRef} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Maximum Latitude - Image's North Edge.</Form.Label>
              <Form.Control ref={maxLatitudeRef} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Maximum Longitude - Image's East Edge.</Form.Label>
              <Form.Control ref={maxLongitudeRef} />
            </Form.Group>

            <h4>Enter Time (EST)</h4>
            {/* Pass EST date/time state and callbacks to TimeInput */}
            <TimeInput
              date={estDate}
              time={estTime}
              onDateChange={setEstDate}
              onTimeChange={setEstTime}
              onUtcTimeChange={handleUtcTimeChange}
            />

            <Button onClick={displayImage}>Find Image</Button>
          </div>
        </div>

        {/* Right side: image display component */}
        <div
          style={{
            flex: "1 1 50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 2rem",
            boxSizing: "border-box",
          }}
        >
          <ImageDisplay imageURL={imageURL} altText={altText} />
        </div>
      </div>
    </div>
  );
}

export default EarthImageViewer;
