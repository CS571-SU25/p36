import "./Home.css";
import NavBar from "./NavBar";

function Home() {

  return (
    <div>
      {/* Title and attribution */}
      <h1>🌍 ClimaTracker</h1>

      {/* Navigation bar */}
      <NavBar />
      <br></br>
      
       <div className="container mt-4">
        <p>
          <strong>Welcome to ClimaTracker!</strong> This interactive space-themed app lets you
          explore Earth using real NASA data.
        </p>
        <p>
          🔭 <strong>Earth Image Viewer:</strong> Enter a latitude, longitude, and date to view real satellite
          imagery of Earth at that location and time. If the image is unavailable, the app will notify you.
        </p>
        <p>
          🌪️ <strong>Natural Events Tracker:</strong> View a live feed of global natural disasters such as wildfires,
          storms, and volcanoes, pulled in real-time from NASA's EONET API.
        </p>
        <p>
          📌 Each event includes a “View Image” button that auto-fills the Earth Image Viewer with its
          location and date, so you can instantly explore real imagery of that event.
        </p>
        <p>
          🔍 Use the filter dropdown to sort natural events by type (e.g., Wildfires, Volcanoes).
        </p>
        <p>
          Enjoy exploring our planet through the lens of real-time satellite data! 🚀
        </p>
      </div>

    </div>
  );
}

export default Home;
