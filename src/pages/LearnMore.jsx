import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import services from "../data/services";

const LearnMore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sectionRefs = useRef({});
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [focusedSection, setFocusedSection] = useState(null);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const headerHeight = 100;

  // Hero images for the introductory section
  const heroImages = [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1493676304819-0d7a9dca43e5?w=1200&h=800&fit=crop",
  ];

  // Rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Initialize image indexes for each service
  useEffect(() => {
    const initialIndexes = {};
    services.forEach((service) => {
      initialIndexes[service.id] = 0;
    });
    setCurrentImageIndex(initialIndexes);
  }, []);

  // Set up image rotation for each service
  useEffect(() => {
    const intervals = {};

    services.forEach((service) => {
      intervals[service.id] = setInterval(() => {
        setCurrentImageIndex((prev) => ({
          ...prev,
          [service.id]: (prev[service.id] + 1) % service.images.length,
        }));
      }, 5000); // Change image every 5 seconds
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, []);

  // Scroll to section with header offset and focus management
  const scrollToSection = (sectionId, focusElement = true) => {
    if (!sectionRefs.current[sectionId]) return;

    setIsScrolling(true);
    const element = sectionRefs.current[sectionId];
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Update URL without triggering navigation
    window.history.replaceState(null, null, `#${sectionId}`);

    // Set focus to the section for accessibility
    if (focusElement) {
      setTimeout(() => {
        element.setAttribute("tabindex", "-1");
        element.focus({ preventScroll: true });
        setFocusedSection(sectionId);
      }, 1000);
    }

    setTimeout(() => setIsScrolling(false), 1000);
  };

  // Handle initial navigation
  useEffect(() => {
    if (id && !isScrolling) {
      scrollToSection(id);
    }
  }, [id]);

  // Handle direct anchor links on page load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && services.some((service) => service.id === hash)) {
        navigate(`/learnmore/${hash}`, { replace: true });
      }
    };

    // Check for hash on initial load
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash && services.some((service) => service.id === hash)) {
        navigate(`/learnmore/${hash}`, { replace: true });
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [navigate]);

  const handleScrollDown = (currentId) => {
    const currentIndex = services.findIndex(
      (service) => service.id === currentId
    );
    const nextService = services[currentIndex + 1];
    if (nextService) {
      navigate(`/learnmore/${nextService.id}`);
    }
  };

  // Scroll to services section
  const scrollToServices = () => {
    const servicesSection = document.getElementById("services-section");
    if (servicesSection) {
      const elementPosition = servicesSection.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight * 0.5;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Manual image navigation
  const goToImage = (serviceId, index) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [serviceId]: index,
    }));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, serviceId) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      handleScrollDown(serviceId);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const currentIndex = services.findIndex(
        (service) => service.id === serviceId
      );
      const prevService = services[currentIndex - 1];
      if (prevService) {
        navigate(`/learnmore/${prevService.id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans">
      {/* Hero Section - 90vh */}
      <div className="h-[100vh] relative overflow-hidden">
        {/* Background Images with Transition */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHeroImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Creative service ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Unleash Your <span className="text-[#D4AF37]">Creative</span> Vision
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-8">
            We transform ideas into extraordinary experiences through our
            comprehensive creative services
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={scrollToServices}
              className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#B8941F] transition-colors transform hover:-translate-y-1 duration-300"
            >
              Explore Our Services
            </button>
            <a
              href="https://t.me/creative_services_ethiopia"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-colors"
            >
              Contact Us Now
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={scrollToServices}
            className="text-white focus:outline-none"
            aria-label="Scroll to services"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div
        id="services-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <h1 className="text-4xl font-bold text-center text-[#D4AF37] mb-12">
          Our Services
        </h1>

        {services.map((service) => (
          <section
            key={service.id}
            id={service.id}
            ref={(el) => (sectionRefs.current[service.id] = el)}
            className="my-12 p-6 bg-white rounded-lg shadow-md scroll-mt-24 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            tabIndex={focusedSection === service.id ? -1 : undefined}
            onKeyDown={(e) => handleKeyDown(e, service.id)}
            aria-labelledby={`heading-${service.id}`}
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{service.icon}</span>
              <h2
                id={`heading-${service.id}`}
                className="text-2xl font-bold text-[#D4AF37]"
              >
                {service.title}
              </h2>
            </div>

            {/* Multi-paragraph description */}
            <div className="text-gray-700 mb-6 space-y-4">
              {service.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">
                  What We Offer:
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {service.features.map((feature, index) => (
                    <li key={index} className="mb-1">
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Telegram contact link */}
                <div className="mt-6">
                  <a
                    href={service.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[#0088CC] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#006A9E] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0088CC]"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.141-.259.259-.374.261l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                    </svg>
                    Contact us on Telegram
                  </a>
                </div>
              </div>

              {/* Image carousel */}
              <div className="relative">
                <div className="overflow-hidden rounded-lg shadow-md">
                  <img
                    src={service.images[currentImageIndex[service.id] || 0]}
                    alt={`${service.title} - Image ${
                      currentImageIndex[service.id] + 1
                    } of ${service.images.length}`}
                    className="w-full h-64 object-cover transition-opacity duration-500"
                  />
                </div>

                {/* Image navigation dots */}
                <div className="flex justify-center mt-4 space-x-2">
                  {service.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(service.id, index)}
                      className={`w-3 h-3 rounded-full ${
                        index === (currentImageIndex[service.id] || 0)
                          ? "bg-[#D4AF37]"
                          : "bg-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]`}
                      aria-label={`View image ${index + 1} of ${
                        service.images.length
                      } for ${service.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => navigate("/")}
                className="text-[#D4AF37] font-semibold hover:text-[#B8941F] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
              >
                &larr; Back to Home
              </button>

              {services.findIndex((s) => s.id === service.id) <
                services.length - 1 && (
                <button
                  onClick={() => handleScrollDown(service.id)}
                  className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
                  aria-label={`Scroll to next service: ${
                    services[services.findIndex((s) => s.id === service.id) + 1]
                      .title
                  }`}
                >
                  Next Service &darr;
                </button>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default LearnMore;
