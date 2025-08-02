import { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import CategoryKey from "./CategoryKey";

const COLOR_PALETTE = [
  "#e25822", "#007bff", "#d9534f", "#6c757d", "#17a2b8",
  "#f0ad4e", "#5cb85c", "#6610f2", "#20c997", "#fd7e14"
];

function NaturalEventsTracker() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryColors, setCategoryColors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://eonet.gsfc.nasa.gov/api/v2.1/categories")
      .then((res) => res.json())
      .then((data) => {
        const cats = data.categories || [];
        setCategories(cats);

        const colorsMap = {};
        cats.forEach((cat, idx) => {
          colorsMap[cat.id] = COLOR_PALETTE[idx % COLOR_PALETTE.length];
        });
        setCategoryColors(colorsMap);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const url = selectedCategory === "all"
      ? "https://eonet.gsfc.nasa.gov/api/v2.1/events"
      : `https://eonet.gsfc.nasa.gov/api/v2.1/categories/${selectedCategory}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const topEvents = (data.events || []).slice(0, 300);
        setEvents(topEvents);
      })
      .catch(console.error);
  }, [selectedCategory]);

  function handleViewInViewer(event) {
    if (!event.geometries || event.geometries.length === 0) return;
    const latest = event.geometries[event.geometries.length - 1];

    if (latest.type === "Point") {
      const [lon, lat] = latest.coordinates;
      const time = latest.date;

      sessionStorage.setItem("minLat", lat - 0.5);
      sessionStorage.setItem("maxLat", lat + 0.5);
      sessionStorage.setItem("minLon", lon - 0.5);
      sessionStorage.setItem("maxLon", lon + 0.5);
      sessionStorage.setItem("time", time);

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
      
      <div className="filter-category-container">
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
      </div>

      <br />

      <div style={{ display: "flex" }}>
        {/* Sidebar color key */}
        <div style={{ flex: "0 0 250px", marginRight: "1rem" }}>
          <CategoryKey
            categories={categories}
            categoryColors={categoryColors}
          />
        </div>

        {/* Events list */}
        <div style={{ flexGrow: 1 }}>
          <h4>Active Events</h4>
          <Row>
            {events.length === 0 ? (
              <p>No events found.</p>
            ) : (
              events
                .filter((e) => e.geometries && e.geometries.length > 0)
                .map((event) => {
                  const categoryId = event.categories[0]?.id;
                  const color = categoryColors[categoryId] || "#000";
                  return (
                    <Col key={event.id} xs={12} sm={6} md={4} lg={3}>
                      <EventCard
                        event={event}
                        color={color}
                        onView={handleViewInViewer}
                      />
                    </Col>
                  );
                })
            )}
          </Row>
        </div>
      </div>
    </div>
  );
}

export default NaturalEventsTracker;
