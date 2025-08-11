import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Departments from "./pages/Departments";
import Portfolio from "./pages/Portfolio";
import Team from "./pages/Team";
import Events from "./pages/Events";
import Contact from "./pages/Contact";


function App() {
  return (
    <Router basename="/Project-002-Impact-Production">
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />

            {/* Redirect any unknown route to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
