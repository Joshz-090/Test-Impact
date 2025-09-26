import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContextBase";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const { role, currentUser } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigationItems = [
    { to: "/admin", label: "Dashboard", icon: "📊", end: true },
    { to: "/admin/subscribers", label: "Subscribers", icon: "👥", end: false },
    { to: "/admin/projects", label: "Projects", icon: "📂", end: false },
    ...(role === "super"
      ? [{ to: "/admin/admins", label: "Admins", icon: "🔐", end: false }]
      : []),
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`
      }
    >
      <span className="text-lg mr-3" aria-hidden="true">
        {item.icon}
      </span>
      {item.label}
      {item.to === "/admin/admins" && role === "super" && (
        <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
          Super
        </span>
      )}
    </NavLink>
  );

  // Overlay for mobile sidebar
  const Overlay = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg md:hidden"
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {sidebarOpen && <Overlay />}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100 md:hidden"
            aria-label="Close sidebar"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {currentUser?.email?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">{role} Admin</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between md:hidden">
          <div className="font-semibold text-gray-900">
            {navigationItems.find((item) => item.to === location.pathname)
              ?.label || "Admin"}
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              {currentUser?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Breadcrumb for larger screens */}
        <div className="hidden md:block bg-white border-b">
          <div className="px-8 py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    to="/admin"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400">/</span>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">
                    {navigationItems.find(
                      (item) =>
                        item.to === location.pathname ||
                        (item.to !== "/admin" &&
                          location.pathname.startsWith(item.to))
                    )?.label || "Dashboard"}
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t px-8 py-4 hidden md:block">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>© {new Date().getFullYear()} Admin Panel</span>
            <span>Logged in as {currentUser?.email}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
