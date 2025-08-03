import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Spinner, Pagination } from "react-bootstrap";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import CategoryKey from "./CategoryKey";
import CategoryFilter from "./CategoryFilter";

const COLOR_PALETTE = [
  "#e25822", "#007bff", "#d9534f", "#6c757d", "#17a2b8",
  "#f0ad4e", "#5cb85c", "#6610f2", "#20c997", "#fd7e14"
];

function NaturalEventsTracker() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryColors, setCategoryColors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 32;
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
    setLoading(true);
    const url = selectedCategory === "all"
      ? "https://eonet.gsfc.nasa.gov/api/v2.1/events"
      : `https://eonet.gsfc.nasa.gov/api/v2.1/categories/${selectedCategory}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const topEvents = (data.events || []).filter(e => e.geometries?.length > 0).slice(0, 300);
        setEvents(topEvents);
        setCurrentPage(1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  return (
    <div>
      <h1>Natural Events Tracker</h1>
      <NavBar />
      <br />

      <div className="filter-category-container">
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
      </div>

      <br />

      <div style={{ display: "flex" }}>
        <div style={{ flex: "0 0 250px", marginRight: "1rem", marginLeft: "1rem" }}>
          <CategoryKey
            categories={categories}
            categoryColors={categoryColors}
          />
        </div>

        <div style={{ flexGrow: 1 }}>
          <h4>Active Events</h4>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {currentEvents.length === 0 ? (
                <div className="text-center mt-4">
                  <h4>No events found.</h4>
                </div>
              ) : (
                <Row>
                  {currentEvents.map((event) => {
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
                  })}
                </Row>
              )}

              {currentEvents.length > 0 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NaturalEventsTracker;
