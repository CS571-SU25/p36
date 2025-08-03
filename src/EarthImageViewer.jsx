import { useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import NavBar from "./NavBar";
import ImageDisplay from "./ImageDisplay";

function EarthImageViewer() {
  // input refs
  const minLatitudeRef = useRef();
  const minLongitudeRef = useRef();
  const maxLatitudeRef = useRef();
  const maxLongitudeRef = useRef();
  const timeRef = useRef();
  

  const [imageURL, setImageURL] = useState();
  const [altText, setAltText] = useState("");


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
      timeRef.current.value = time;

      sessionStorage.removeItem("minLat");
      sessionStorage.removeItem("maxLat");
      sessionStorage.removeItem("minLon");
      sessionStorage.removeItem("maxLon");
      sessionStorage.removeItem("time");
    }
  }, []);

  function displayImage() {
    fetch(
      `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/png&TRANSPARENT=TRUE&HEIGHT=512&WIDTH=512&CRS=EPSG:4326&BBOX=${minLatitudeRef.current.value},${minLongitudeRef.current.value},${maxLatitudeRef.current.value},${maxLongitudeRef.current.value}&TIME=${timeRef.current.value}`
    )
      .then((res) => res.blob())
      .then((blob) => {
        setImageURL(URL.createObjectURL(blob));
        setAltText(`Satellite image of Earth taken on ${timeRef.current.value}`);
      })
      .catch((err) => {
        console.log(err);
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
          height: "calc(100vh - 180px)", // adjust as needed so content is vertically centered
          gap: "2rem",
        }}
      >
        {/* Left half: inputs centered */}
        <div
          style={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", // horizontal center
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

            <h4>Enter Time</h4>
            <Form.Group className="mb-3">
              <Form.Label>UTC Datetime: YYYY-MM-DDTHH:MM:SSZ</Form.Label>
              <Form.Control ref={timeRef} />
            </Form.Group>

            <Button onClick={displayImage}>Find Image</Button>
          </div>
        </div>

        {/* Right half: image centered */}
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
