// Import NavLink from react-router-dom to handle navigation with active link styling
import { NavLink } from "react-router-dom";

// Import Bootstrap components for styling and layout
import { Navbar, Container, Nav } from "react-bootstrap";

// Functional component for the navigation bar
function NavBar() {
  return (
    // Main Bootstrap Navbar component with dark theme and responsive behavior (expands at 'md' screen size)
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        {/* Hamburger icon that appears on small screens to toggle the menu */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Collapsible content of the Navbar (links) */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {/* Each Nav.Link uses NavLink underneath for routing, keeping the correct active state */}

            {/* Link to home page ('/') */}
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>

            {/* Link to the Earth Image Viewer page */}
            <Nav.Link as={NavLink} to="/viewer">
              Earth Image Viewer
            </Nav.Link>

            {/* Link to the Natural Events Tracker page */}
            <Nav.Link as={NavLink} to="/events">
              Natural Events Tracker
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Export the NavBar component so it can be used in other parts of the app
export default NavBar;
