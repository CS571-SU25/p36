import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

function NaturalEventsTracker() {

  // list of all natural events
  const [events, setEvents] = useState([]);
  // list of all categories
  const [categories, setCategories] = useState([]);
  // the currently selected category
  const [selectedCategory, setSelectedCategory] = useState("all");

  // to go to EarthImageViewer page once clicking on "View in /viewer"
  const navigate = useNavigate();


  // Fetch events from EONET on load or when category changes
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
      const eventsData = data.events || [];
      // get only the top 300 events for performance
      const topEvents = eventsData.slice(0, 300);
      console.log("Fetched events:", topEvents);
      setEvents(topEvents);
    })
    .catch((err) => {
      console.error("Error fetching events:", err);
    });
}, [selectedCategory]);

  // Fetch categories for filter dropdown in html
  // this will only run once when the component mounts
  useEffect(() => {
    fetch("https://eonet.gsfc.nasa.gov/api/v2.1/categories")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.categories);
        setCategories(data.categories);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);


  // Handle clicking "View in /viewer"
  function handleViewInViewer(event) {
    if (event.geometries.length === 0) return;

    const latest = event.geometries[event.geometries.length - 1];

    if (latest.type === "Point") {
      const [lon, lat] = latest.coordinates;
      const time = latest.date;

      // Store bounding box and time into sessionStorage
      sessionStorage.setItem("minLat", lat - 0.5);
      sessionStorage.setItem("maxLat", lat + 0.5);
      sessionStorage.setItem("minLon", lon - 0.5);
      sessionStorage.setItem("maxLon", lon + 0.5);
      sessionStorage.setItem("time", time);

      // Navigate to /viewer
      navigate("/viewer");
    } else {
      alert("Unsupported geometry type: " + latest.type);
    }

  }


  return <div>
    
      <h1>Natural Events Tracker</h1>
      <NavBar />
      <br />

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
      <div>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => {
            const lastGeo = event.geometries[event.geometries.length - 1];
            const coordDisplay =
              lastGeo.type === "Point"
                ? `${lastGeo.coordinates[1].toFixed(2)}, ${lastGeo.coordinates[0].toFixed(2)}`
                : "N/A";

            return (
              <div key={event.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
                <h5>{event.title}</h5>
                <p>Date: {lastGeo.date}</p>
                <p>Coordinates: {coordDisplay}</p>
                <Button onClick={() => handleViewInViewer(event)}>
                  View in EarthImageViewer
                </Button>
              </div>
            );
          })
        )}
      </div>

  </div>


}

export default NaturalEventsTracker;