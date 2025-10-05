import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { getUpcomingEvents, getPastEvents } from "../utils/eventUtils";
import CountdownTimer from "../components/CountdownTimer";
import ImageCarousel from "../components/ImageCarousel";
import VideoEmbed from "../components/VideoEmbed";
import toast from "react-hot-toast";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch events from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const [upcomingResult, pastResult] = await Promise.all([
          getUpcomingEvents(),
          getPastEvents(),
        ]);

        if (upcomingResult.success) {
          setUpcomingEvents(upcomingResult.events);
        } else {
          toast.error("Failed to load upcoming events");
        }

        if (pastResult.success) {
          setPastEvents(pastResult.events);
        } else {
          toast.error("Failed to load past events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("An error occurred while loading events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get unique categories from all events
  const allEvents = [...upcomingEvents, ...pastEvents];
  const categories = [
    "all",
    ...new Set(allEvents.map((event) => event.category)),
  ];

  // Filter upcoming events by category
  const filteredUpcomingEvents =
    filterCategory !== "all"
      ? upcomingEvents.filter((event) => event.category === filterCategory)
      : upcomingEvents;

  // Dynamic statistics
  const totalEvents = allEvents.length;
  const totalAttendees = allEvents.reduce((sum) => {
    // This would need to be calculated from actual attendee data
    return sum + Math.floor(Math.random() * 500) + 50; // Placeholder
  }, 0);

  useEffect(() => {
    let scene, camera, renderer, particles;
    let animationFrameId;

    const initThreeJS = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Create particle system
      const particlesGeometry = new THREE.BufferGeometry();
      const count = 1000;
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 0.02,
        transparent: true,
        opacity: 0.8,
      });

      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.002;
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    };

    // GSAP animations
    const ctx = gsap.context(() => {
      // Only initialize Three.js if canvas is available
      if (canvasRef.current) {
        initThreeJS();
      }

      // Hero animation with 3D effect
      gsap.from(".hero-title", {
        duration: 1.5,
        y: 100,
        opacity: 0,
        rotationX: 45,
        ease: "power3.out",
        stagger: 0.2,
      });

      // Event cards with 3D hover and reveal
      const eventCards = gsap.utils.toArray(".event-card");
      if (eventCards.length) {
        eventCards.forEach((card, i) => {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            rotationX: 15,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });

          // 3D tilt effect on hover
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              rotationY: 5,
              rotationX: 5,
              scale: 1.03,
              duration: 0.3,
              ease: "power2.out",
            });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              rotationY: 0,
              rotationX: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });
      }

      // Stats animation
      gsap.utils.toArray(".stat-item").forEach((item, i) => {
        gsap.from(item, {
          y: 50,
          opacity: 0,
          duration: 1,
          delay: i * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [upcomingEvents, pastEvents]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedEvent]);

  // Newsletter submit handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    toast.success("Subscribed successfully!");
  };

  // Register handler
  const handleRegister = () => {
    toast.success("Registered successfully!");
  };

  // Format date for display
  const formatEventDate = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString || "00:00"}`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#010120] to-[#dddddd] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p className="text-white text-xl mt-4">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#010120] to-[#888888] text-white font-sans overflow-hidden"
      ref={containerRef}
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }}
        />
        <div className="relative z-10 text-center px-4 backdrop-blur-sm bg-black/30 rounded-2xl py-12 mx-4">
          <h1 className="hero-title text-4xl md:text-7xl font-bold mb-6 font-montserrat">
            Our <span className="text-[#D4AF37]">Events</span>
          </h1>
          <p className="hero-title text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
            Join us for inspiring exhibitions, workshops, and creative
            experiences
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white/90 backdrop-blur-sm section-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-montserrat">
              Upcoming <span className="text-[#D4AF37]">Events</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mark your calendar for these exciting upcoming events
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors transform hover:-translate-y-1 duration-300 ${
                  filterCategory === category
                    ? "bg-[#D4AF37] text-black shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUpcomingEvents.map((event) => (
              <div
                key={event.id}
                className="event-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <ImageCarousel
                    images={event.images}
                    className="w-full h-48"
                  />
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Upcoming
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2 font-montserrat">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="mr-4">
                      📅 {formatEventDate(event.eventDate, event.eventTime)}
                    </span>
                    <span>📍 {event.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {event.shortDescription}
                  </p>

                  {/* Countdown Timer */}
                  <div className="mb-4">
                    <CountdownTimer
                      eventDate={event.eventDate}
                      eventTime={event.eventTime}
                      className="mb-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#D4AF37] font-medium">
                      Organizer: {event.organizerName}
                    </span>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors transform hover:-translate-y-1 duration-300"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredUpcomingEvents.length === 0 && (
              <p className="text-center text-gray-600 col-span-full">
                No upcoming events in this category.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-gray-50/80 backdrop-blur-sm section-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-montserrat">
              Past <span className="text-[#D4AF37]">Events</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Relive the magic of our previous events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="event-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <ImageCarousel
                    images={event.images}
                    className="w-full h-48"
                  />
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Past
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2 font-montserrat">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="mr-4">
                      📅 {formatEventDate(event.eventDate, event.eventTime)}
                    </span>
                    <span>📍 {event.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {event.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#D4AF37] font-medium">
                      Organizer: {event.organizerName}
                    </span>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors transform hover:-translate-y-1 duration-300"
                    >
                      View Gallery
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-black/20 text-white hover:text-gray-300 text-2xl z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                aria-label="Close modal"
              >
                ×
              </button>

              {/* Event Images */}
              <div className="h-64">
                <ImageCarousel
                  images={selectedEvent.images}
                  className="w-full h-full"
                />
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-black mb-4 font-montserrat">
                  {selectedEvent.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      Event Details
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-center">
                        <span className="w-24 font-medium">Date:</span>
                        {formatEventDate(
                          selectedEvent.eventDate,
                          selectedEvent.eventTime
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 font-medium">Location:</span>
                        {selectedEvent.location}
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 font-medium">Category:</span>
                        {selectedEvent.category}
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 font-medium">Organizer:</span>
                        {selectedEvent.organizerName}
                      </div>
                      {selectedEvent.contactLink && (
                        <div className="flex items-center">
                          <span className="w-24 font-medium">Contact:</span>
                          <a
                            href={selectedEvent.contactLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {selectedEvent.contactLink}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {selectedEvent.shortDescription}
                    </p>

                    {/* Full Description Paragraphs */}
                    {selectedEvent.fullDescription &&
                      selectedEvent.fullDescription.length > 0 && (
                        <div className="space-y-2">
                          {selectedEvent.fullDescription.map(
                            (paragraph, index) => (
                              <p key={index} className="text-gray-700">
                                {paragraph}
                              </p>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </div>

                {/* Video Embed */}
                {selectedEvent.videoLink && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      Event Video
                    </h3>
                    <VideoEmbed
                      videoLink={selectedEvent.videoLink}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Countdown Timer for upcoming events */}
                {new Date(selectedEvent.eventDate) > new Date() && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      Time Until Event
                    </h3>
                    <CountdownTimer
                      eventDate={selectedEvent.eventDate}
                      eventTime={selectedEvent.eventTime}
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={
                      new Date(selectedEvent.eventDate) > new Date()
                        ? handleRegister
                        : () => toast.success("View full gallery (placeholder)")
                    }
                    className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors transform hover:-translate-y-1 duration-300"
                  >
                    {new Date(selectedEvent.eventDate) > new Date()
                      ? "Register Now"
                      : "View Full Gallery"}
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Stats */}
      <section className="py-20 bg-black/90 text-white backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-montserrat">
              Event <span className="text-[#D4AF37]">Statistics</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our impact through events and experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: totalEvents, label: "Events Hosted" },
              {
                value: `${totalAttendees.toLocaleString()}+`,
                label: "Total Attendees",
              },
              {
                value: `${allEvents.reduce(
                  (sum, event) => sum + (event.images?.length || 0),
                  0
                )}+`,
                label: "Event Images",
              },
              { value: "95%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center stat-item">
                <div className="text-4xl font-bold text-[#D4AF37] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 font-['Montserrat']">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to our newsletter to be the first to know about upcoming
            events
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
          >
            <label htmlFor="email-input" className="sr-only">
              Email address
            </label>
            <input
              id="email-input"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37] text-black"
              aria-label="Enter your email address"
              required
            />
            <button
              type="submit"
              className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Events;
