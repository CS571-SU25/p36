import NavBar from "./NavBar";
import InfoCarousel from "./InfoCarousel.jsx";

function Home() {
  return (
    <div>
      <h1 className="text-center">🌍 ClimaTracker</h1>
      <NavBar />
      <br />

      {/* Welcome / General Intro Text */}
      <div style={{ fontSize: "1.25rem", lineHeight: 1.5, marginBottom: "2rem" }} className="text-center">
        <p>
          <strong>Welcome to ClimaTracker!</strong> This is an interactive, space-themed app created by Vihan Dalvi, a CS571 student. It lets you explore our planet using real NASA satellite data.
        </p>
        <p>
          Discover real-time images of Earth and stay updated on natural events like wildfires, storms, and volcanoes, all visualized with accurate geospatial data.
        </p>
        <p>
          Use the tools to zoom in on locations, filter event types, and understand how time and coordinates relate to satellite imagery.
        </p>
        <p style={{ fontSize: "1.3rem", marginTop: "1rem" }}>
          🚀 Enjoy your journey exploring Earth from above!
        </p>
      </div>

      {/* Carousel for feature-specific info */}
      <InfoCarousel />
    </div>
  );
}

export default Home;
