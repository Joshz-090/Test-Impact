import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
// Public pages (code-split)
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Departments = lazy(() => import("./pages/Departments"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Team = lazy(() => import("./pages/Team"));
const Events = lazy(() => import("./pages/Events"));
const Contact = lazy(() => import("./pages/Contact"));
const LearnMore = lazy(() => import("./pages/LearnMore"));
const ImpactDetail = lazy(() => import("./pages/ImpactDetail"));
const StartProject = lazy(() => import("./pages/StartProject"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Gallery = lazy(() => import("./pages/Gallery"));
const NotFound = lazy(() => import("./pages/NotFound"));
import { AuthProvider } from "./context/AuthContext";
import { MetricsProvider } from "./context/MetricsContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
import { Toaster } from "react-hot-toast";
// Admin pages (code-split with direct imports)
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminSubscribers = lazy(() => import("./pages/admin/Subscribers"));
const AdminAdmins = lazy(() => import("./pages/admin/Admins"));
const AdminUnauthorized = lazy(() => import("./pages/admin/Unauthorized"));
const AdminBootstrap = lazy(() => import("./pages/admin/Bootstrap"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminDepartments = lazy(() => import("./pages/admin/AdminDepartments"));
const AdminAddMember = lazy(() => import("./pages/admin/AdminAddMember"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminSetup = lazy(() => import("./pages/admin/Setup"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));

// Scroll-to-top component
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.replace("#", ""));

      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" });
          return true;
        }
        return false;
      };

      if (!tryScroll()) {
        // Retry after render/layout settles
        setTimeout(tryScroll, 50);
        setTimeout(tryScroll, 150);
      }
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hide navbar on admin pages */}
      {!location.pathname.startsWith("/admin") &&
        !location.pathname.startsWith("/start-project") &&
        !location.pathname.startsWith("/thank-you") &&
        !location.pathname.startsWith("/impact") && <Navbar />}
      <ScrollToTop />
      <main>
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-primary-500 rounded-full" />
              </div>
            }
          >
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
              <Route path="/impact/:id" element={<ImpactDetail />} />
              <Route path="/start-project" element={<StartProject />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/gallery" element={<Gallery />} />

              {/* Admin setup / login routes */}
              <Route path="/admin/setup" element={<AdminSetup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/unauthorized"
                element={<AdminUnauthorized />}
              />
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
                <Route path="projects" element={<AdminProjects />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="departments" element={<AdminDepartments />} />
                <Route path="members" element={<AdminAddMember />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route
                  path="admins"
                  element={
                    <ProtectedRoute requireSuper>
                      <AdminAdmins />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#D4AF37",
              secondary: "#fff",
            },
          },
        }}
      />
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
