import { NavLink } from "react-router-dom";
// - HashRouter: wraps your app to enable client-side routing with hash URLs (#)
// - Routes: container for all Route definitions
// - Route: defines a path and which component to render for that path
// - NavLink: special link component that knows if it's "active" based on the URL
import EarthImageViewer from "./EarthImageViewer";
import NaturalEventsTracker from "./NaturalEventsTracker";


function NavBar() {


    return (

            <nav>

                {/* NavLink creates a link to the home page ('/') */}
                <NavLink to="/">Home</NavLink> |{" "}
                {/* NavLink creates a link to the Earth Image Viewer page */}
                <NavLink to="/viewer">Earth Image Viewer</NavLink> |{" "}
                {/* NavLink creates a link to the Natural Events Tracker page */}
                <NavLink to="/events">Natural Events Tracker</NavLink>

            </nav>
  
    );

}

export default NavBar;
