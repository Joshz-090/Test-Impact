import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import LearnMore from "./pages/LearnMore";
import StartProject from "./pages/StartProject";
import ThankYou from "./pages/ThankYou";
import { AuthProvider } from "./context/AuthContext";
import { MetricsProvider } from "./context/MetricsContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import {
  Login as AdminLogin,
  Dashboard as AdminDashboard,
  Subscribers as AdminSubscribers,
  Admins as AdminAdmins,
  Unauthorized as AdminUnauthorized,
  Bootstrap as AdminBootstrap,
} from "./pages/admin";
import AdminProjects from "./pages/admin/AdminProjects"; // ✅ Direct import
import AdminSetup from "./pages/admin/Setup";

// Scroll-to-top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hide navbar on admin pages */}
      {!location.pathname.startsWith("/admin") && <Navbar />}
      <ScrollToTop />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/team" element={<Team />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/learnmore/:id" element={<LearnMore />} />
          <Route path="/start-project" element={<StartProject />} />
          <Route path="/thank-you" element={<ThankYou />} />

          {/* Admin setup / login routes */}
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/unauthorized" element={<AdminUnauthorized />} />
          <Route path="/admin/bootstrap" element={<AdminBootstrap />} />

          {/* Admin protected area */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
            <Route
              path="admins"
              element={
                <ProtectedRoute requireSuper>
                  <AdminAdmins />
                </ProtectedRoute>
              }
            />
            <Route path="projects" element={<AdminProjects />} />{" "}
            {/* ✅ fixed */}
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router basename="/">
      <AuthProvider>
        <MetricsProvider>
          <AppContent />
        </MetricsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
