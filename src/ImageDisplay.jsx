import { useState } from "react";

function ImageDisplay({ imageURL, altText }) {
  const [hasError, setHasError] = useState(false);

  if (!imageURL) return null;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <img
        src={imageURL}
        alt={hasError ? "Image failed to load" : altText}
        onError={() => setHasError(true)}
        onLoad={() => setHasError(false)} // reset if it loads successfully later
        style={{
          maxWidth: "90%",
          maxHeight: "600px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          objectFit: "cover",
        }}
      />
      <p style={{ marginTop: "10px", fontStyle: "italic", color: "#666" }}>
        {hasError
          ? "Sorry, the image could not be loaded."
          : altText}
      </p>
      {!hasError && (
        <p
          style={{
            marginTop: "6px",
            fontSize: "0.85rem",
            color: "#b33",
            fontWeight: "600",
          }}
        >
          ⚠️ Note: Black spots may appear on NASA EONET images due to satellite data gaps.
        </p>
      )}
    </div>
  );
}

export default ImageDisplay;
