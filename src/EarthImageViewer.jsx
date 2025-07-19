import { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import NavBar from "./NavBar";

function EarthImageViewer() {

  // input parameters
  const minLatitudeRef = useRef();
  const minLongitudeRef = useRef();
  const maxLatitudeRef = useRef();
  const maxLongitudeRef = useRef();
  const timeRef = useRef();

  // current imageURL
  const [imageURL, setImageURL] = useState();


  // Prefill inputs if data in sessionStorage (from NaturalEventsTracker)
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

       // Clear the stored data so next visits start fresh
      sessionStorage.removeItem("minLat");
      sessionStorage.removeItem("maxLat");
      sessionStorage.removeItem("minLon");
      sessionStorage.removeItem("maxLon");
      sessionStorage.removeItem("time");

      // maybe automatically fetch image on load
      // displayImage();
    }
  }, []); // Run once on component mount


  function displayImage() {

    // the current.values from the DOM are passed into the fetch
    // uses the NASA GIBS api: https://nasa-gibs.github.io/gibs-api-docs/access-basics/#ogc-web-map-tile-service-wmts
    // using the WMS (Web Map Service)
    fetch(`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/png&TRANSPARENT=TRUE&HEIGHT=512&WIDTH=512&CRS=EPSG:4326&BBOX=${minLatitudeRef.current.value},${minLongitudeRef.current.value},${maxLatitudeRef.current.value},${maxLongitudeRef.current.value}&TIME=${timeRef.current.value}`)
    .then(
      // convert the response body to binary data that represents the raw image
      res => {
        return res.blob();
      }
    ).then(
      blob => {
        // creating a temporary URL that points to the blob data
        // also triggers re-render so image shows up
        setImageURL(URL.createObjectURL(blob));
        console.log("Generated image URL:", imageURL);  // <-- Add this
      }
    ).catch(err =>
      {
        console.log(err);
      }
    )

  }

  return <div>

        <h1>Earth Image Viewer</h1>
        <NavBar></NavBar>
        <br></br>

        <h4>Enter Coordinates</h4> 
        <br></br>

        {/* The Group links together the label and input*/}
        <Form.Group>
          <Form.Label>Minimum Latitude - Image's South Edge.</Form.Label>
          <Form.Control ref={minLatitudeRef}></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Minimum Longitude - Image's West Edge.</Form.Label>
          <Form.Control ref={minLongitudeRef}></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Maximum Latitude - Image's North Edge.</Form.Label>
          <Form.Control ref={maxLatitudeRef}></Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Maximum Longitude - Image's East Edge.</Form.Label>
          <Form.Control ref={maxLongitudeRef}></Form.Control>
        </Form.Group>
        <br></br>

        <h4>Enter Time</h4> 
        <br></br>
        <Form.Group>
          <Form.Label>UTC Datetime: YYYY-MM-DDTHH:MM:SSZ</Form.Label>
          <Form.Control ref={timeRef}></Form.Control>
        </Form.Group>


        <br></br>
        <Button onClick={displayImage}>Find Image</Button>
        <br></br>
        
        <div>
          {imageURL && (
            <img
              src={imageURL}
              alt="Earth from NASA GIBS"
              style={{ display: "block", margin: "20px auto 0" }}
            />
          )}
        </div>

        

  </div>


}

export default EarthImageViewer;