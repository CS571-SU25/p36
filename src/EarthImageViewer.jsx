import { useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import NavBar from "./NavBar";
import ImageDisplay from "./ImageDisplay";
import TimeInput from "./TimeInput";

function utcToEstDateTime(utcISOString) {
  if (!utcISOString) return { date: "", time: "" };

  const utcDate = new Date(utcISOString);

  // EST is UTC -5, so subtract 5 hours using UTC methods:
  const estDate = new Date(utcDate.getTime() - 5 * 60 * 60 * 1000);

  // Use UTC getters to get date components (not local getters!)
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
  // input refs for coordinates
  const minLatitudeRef = useRef();
  const minLongitudeRef = useRef();
  const maxLatitudeRef = useRef();
  const maxLongitudeRef = useRef();

  // state for image URL, alt text, and UTC time string
  const [imageURL, setImageURL] = useState();
  const [altText, setAltText] = useState("");

  // EST inputs for date/time
  const [estDate, setEstDate] = useState("");
  const [estTime, setEstTime] = useState("");

  // UTC time string for API
  const [utcTime, setUtcTime] = useState("");

  // On mount, load sessionStorage values if present
  useEffect(() => {
    const minLat = sessionStorage.getItem("minLat");
    const maxLat = sessionStorage.getItem("maxLat");
    const minLon = sessionStorage.getItem("minLon");
    const maxLon = sessionStorage.getItem("maxLon");
    const time = sessionStorage.getItem("time");

    if (minLat && maxLat && minLon && maxLon && time) {
      minLatitudeRef.current.value = minLat;
      maxLatitudeRef.current.value = maxLat;
      minLongitudeRef.current.value = minLon;
      maxLongitudeRef.current.value = maxLon;

      const { date, time: t } = utcToEstDateTime(time);
      setEstDate(date);
      setEstTime(t);
      setUtcTime(time);

      // Clear sessionStorage after loading
      sessionStorage.removeItem("minLat");
      sessionStorage.removeItem("maxLat");
      sessionStorage.removeItem("minLon");
      sessionStorage.removeItem("maxLon");
      sessionStorage.removeItem("time");
    }
  }, []);

  // Update UTC time when EST date/time changes from TimeInput
  function handleUtcTimeChange(newUtc) {
    setUtcTime(newUtc);
  }

  // Fetch and display image from NASA API
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
        {/* Left half: input form */}
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

        {/* Right half: image display */}
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
