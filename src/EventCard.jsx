import { Button, Card } from "react-bootstrap";

function EventCard({ event, color, onView }) {
  if (!event.geometries || event.geometries.length === 0) return null;

  const lastGeo = event.geometries[event.geometries.length - 1];
  const coordDisplay =
    lastGeo.type === "Point"
      ? `${lastGeo.coordinates[1].toFixed(2)}, ${lastGeo.coordinates[0].toFixed(2)}`
      : "N/A";

  return (
    <Card className="mb-4 shadow-sm h-100" style={{ borderLeft: `5px solid ${color}` }}>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{event.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{lastGeo.date}</Card.Subtitle>
        <Card.Text className="mb-3">
          <strong>Coordinates:</strong> {coordDisplay}
        </Card.Text>

        <div className="mt-auto">
          <Button variant="primary" onClick={() => onView(event)}>
            View in EarthImageViewer
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default EventCard;
