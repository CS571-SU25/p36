import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard"; // Reusable component to display a single event
// arrange cards in a responsive grid layout
import {Row, Col} from "react-bootstrap";


function NaturalEventsTracker() {
  // State: All fetched events
  const [events, setEvents] = useState([]);
  // State: List of event categories for the dropdown
  const [categories, setCategories] = useState([]);
  // State: The currently selected category from the dropdown
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Navigation hook to redirect to the EarthImageViewer page
  const navigate = useNavigate();

  // Fetch natural events from the EONET API when the selected category changes
  useEffect(() => {
    let url = "";

    if (selectedCategory === "all") {
      url = "https://eonet.gsfc.nasa.gov/api/v2.1/events";
    } else {
      url = `https://eonet.gsfc.nasa.gov/api/v2.1/categories/${selectedCategory}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // Only keep top 300 events for performance
        const topEvents = (data.events || []).slice(0, 300);
        console.log("Fetched events:", topEvents);
        setEvents(topEvents);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, [selectedCategory]); // Re-run when user selects a different category

  // Fetch available categories once on component mount
  useEffect(() => {
    fetch("https://eonet.gsfc.nasa.gov/api/v2.1/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Called when user clicks "View in EarthImageViewer" on an event
  function handleViewInViewer(event) {
    if (!event.geometries || event.geometries.length === 0) return;

    const latest = event.geometries[event.geometries.length - 1];

    if (latest.type === "Point") {
      const [lon, lat] = latest.coordinates;
      const time = latest.date;

      // Save bounding box and date to sessionStorage for use in EarthImageViewer
      sessionStorage.setItem("minLat", lat - 0.5);
      sessionStorage.setItem("maxLat", lat + 0.5);
      sessionStorage.setItem("minLon", lon - 0.5);
      sessionStorage.setItem("maxLon", lon + 0.5);
      sessionStorage.setItem("time", time);

      // Redirect user to viewer page
      navigate("/viewer");
    } else {
      alert("Unsupported geometry type: " + latest.type);
    }
  }

  return (
    <div>
      <h1>Natural Events Tracker</h1>
      <NavBar />
      <br />

      {/* Dropdown to select a category */}
      <Form.Label>Filter by Category</Form.Label>
      <Form.Select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="all">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </Form.Select>

      <br />
      <h4>Active Events</h4>

      {/* Show list of events using EventCard component */}
      <Row>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events
            .filter((e) => e.geometries && e.geometries.length > 0)
            .map((event) => (
              <Col key={event.id} xs={12} sm={6} md={4} lg={3}>
                <EventCard event={event} onView={handleViewInViewer} />
              </Col>
            ))
        )}
      </Row>
    </div>
  );
}

export default NaturalEventsTracker;
