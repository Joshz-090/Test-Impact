import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/img/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get current path to highlight active link
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'departments', label: 'Departments', path: '/departments' },
    { id: 'portfolio', label: 'Portfolio', path: '/portfolio' },
    { id: 'team', label: 'Team', path: '/team' },
    { id: 'events', label: 'Events', path: '/events' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > window.innerHeight * 0.9);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="Impact Production Logo"
              className="h-14 w-10 navbar-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Fallback text logo */}
            <h1
              className="text-2xl font-bold text-[#D4AF37] font-['Montserrat'] navbar-logo"
              style={{ display: 'none' }}
            >
              Impact Production
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:block flex-1 ml-8">
            <div className="flex items-center justify-center space-x-4 navbar-nav">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 font-['Montserrat'] ${
                    currentPath === item.path
                      ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                      : 'text-white hover:text-[#D4AF37] hover:scale-105'
                  }`}
                  onClick={() => setIsMenuOpen(false)} // close mobile menu if open
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#D4AF37] focus:outline-none focus:text-[#D4AF37] transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors font-['Montserrat'] ${
                  currentPath === item.path
                    ? 'text-[#D4AF37] bg-black'
                    : 'text-white hover:text-[#D4AF37]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
