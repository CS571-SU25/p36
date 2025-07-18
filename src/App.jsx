// for routing
import { HashRouter, Routes, Route} from "react-router-dom";
// - HashRouter: wraps your app to enable client-side routing with hash URLs (#)
// - Routes: container for all Route definitions
// - Route: defines a path and which component to render for that path

// my components 
import Home from './Home'
import EarthImageViewer from './EarthImageViewer'
import NaturalEventsTracker from './NaturalEventsTracker'

function App() {

  return <HashRouter>
    
      {/* Defines the routes your app responds to */}
      <Routes>

        {/* When URL is exactly "/", render this welcome message */}
        <Route path="/" element={<Home />} />
          

        {/* When URL is "/viewer", render the EarthImageViewer component */}
        <Route path="/viewer" element={<EarthImageViewer />} />

        {/* When URL is "/events", render the NaturalEventsTracker component */}
        <Route path="/events" element={<NaturalEventsTracker />} />

      </Routes>

</HashRouter>

}

export default App
