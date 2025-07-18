import "./Home.css";
import NavBar from "./NavBar";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      {/* Title and attribution */}
      <h1 className="text-center">🌍 ClimaTracker</h1>
      <p className="text-center"><strong>By Vihan Dalvi</strong></p>

      {/* Navigation bar */}
      <NavBar />

      {/* Intro section */}
      <div className="mt-4">
        <h4>Welcome to ClimaTracker!</h4>
        <p>
          ClimaTracker is a space-themed interactive web application that uses real NASA data to help you:
        </p>
        <ul>
          <li><strong>View real satellite images</strong> of any location on Earth by entering a latitude, longitude, and date.</li>
          <li><strong>Track live natural events</strong> like wildfires, storms, and volcanoes from NASA’s EONET API.</li>
          <li><strong>Explore global events visually</strong> using our built-in image viewer powered by NASA Earth Imagery.</li>
        </ul>
        <p>
          This site is both educational and engaging, designed to make climate data accessible to everyone.
        </p>
      </div>

      
    </div>
  );
}

export default Home;
