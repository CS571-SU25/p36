// CategoryKey.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

export default function CategoryKey({ categories, categoryColors }) {
  return (
    <Card >
      <Card.Body>
        <h5>Category Key</h5>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {categories.map((cat) => (
            <li key={cat.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
              <div
                style={{
                  width: "1rem",
                  height: "1rem",
                  backgroundColor: categoryColors[cat.id] || "#000",
                  marginRight: "0.5rem",
                }}
              ></div>
              {cat.title}
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
}
