import { useState } from "react";
import { Button, Container } from "react-bootstrap";

const infoSlides = [
  {
    title: "How the Earth Image Viewer Works",
    content: (
      <>
        <p style={{ fontSize: "1.2rem" }}>
          🔭 <strong>Earth Image Viewer:</strong> This feature allows you to view satellite images of Earth captured by NASA's MODIS Terra satellite.
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          To display an image, enter a bounding box defined by <em>minimum and maximum latitude and longitude</em> coordinates. These define the south, north, west, and east edges of the image.
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          Coordinates use <strong>decimal degrees</strong>—latitude ranges from -90 (South Pole) to +90 (North Pole), and longitude ranges from -180 to +180 (negative values west of Greenwich).
        </p>
        <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
          <strong>Time Input & Conversion:</strong>
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          The satellite imagery timestamps use <strong>UTC (Coordinated Universal Time)</strong>, a global time standard. However, for user convenience, you input time in <strong>Eastern Standard Time (EST)</strong>.
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          EST is UTC minus 5 hours (UTC-5). For example, when you enter 3:00 PM EST, it corresponds to 8:00 PM UTC.
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          The app converts your EST input into UTC ISO format (e.g., <code>2025-07-31T21:19:00Z</code>) before querying NASA’s API to fetch the correct image.
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          This conversion ensures the imagery you receive aligns exactly with the satellite pass times and geographic bounds you specify.
        </p>
      </>
    ),
  },
  {
    title: "Natural Events Tracker Explanation",
    content: (
      <>
        <p style={{ fontSize: "1.2rem" }}>
          🌪️ <strong>Natural Events Tracker:</strong> This live feed shows ongoing natural events around the globe, such as wildfires, volcanic eruptions, storms, and floods.
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          The data comes directly from NASA's EONET API, which aggregates event reports verified by satellite observations and experts.
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          You can filter the events by category using the dropdown menu to focus on specific types of disasters or phenomena.
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          Each event card includes a <strong>“View Image”</strong> button that automatically fills the Earth Image Viewer’s coordinate and time inputs with the event’s location and latest observation time.
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          This seamless integration lets you instantly visualize satellite imagery of active natural events without manual input.
        </p>
        <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
          This helps users better understand the scale, location, and current status of natural phenomena as seen from space.
        </p>
      </>
    ),
  },
];

function InfoCarousel() {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((oldIndex) => (oldIndex === 0 ? infoSlides.length - 1 : oldIndex - 1));
  }

  function next() {
    setIndex((oldIndex) => (oldIndex === infoSlides.length - 1 ? 0 : oldIndex + 1));
  }

  return (
    <Container className="mt-4 border rounded p-4 bg-light">
      <h2>{infoSlides[index].title}</h2>
      <div>{infoSlides[index].content}</div>

      <div className="d-flex justify-content-between mt-3">
        <Button onClick={prev} variant="secondary">← Previous</Button>
        <Button onClick={next} variant="primary">Next →</Button>
      </div>

      <p className="text-center mt-2">
        Slide {index + 1} of {infoSlides.length}
      </p>
    </Container>
  );
}

export default InfoCarousel;
