import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const threeJsInitialized = useRef(false);

  const events = [
    {
      id: 1,
      title: "Spring Art Exhibition 2024",
      date: "March 15-30, 2024",
      startDate: "2024-03-15",
      endDate: "2024-03-30",
      location: "Contemporary Art Gallery",
      description:
        "A celebration of contemporary art featuring local and international artists. This exhibition showcases innovative works across various mediums including painting, sculpture, digital art, and installations.",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      category: "Exhibition",
      attendees: "500+",
      gallery: [
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      ],
    },
    {
      id: 2,
      title: "Design Week Conference",
      date: "April 10-12, 2024",
      startDate: "2024-04-10",
      endDate: "2024-04-12",
      location: "Convention Center",
      description:
        "Join industry leaders for three days of design innovation and networking. Features keynote speakers, workshops, and networking opportunities for creative professionals.",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      category: "Conference",
      attendees: "300+",
      gallery: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      ],
    },
    {
      id: 3,
      title: "Digital Art Workshop",
      date: "May 5, 2024",
      startDate: "2024-05-05",
      endDate: "2024-05-05",
      location: "Creative Studio",
      description:
        "Learn the latest digital art techniques from our expert team. Hands-on workshop covering digital painting, 3D modeling, and animation fundamentals.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      category: "Workshop",
      attendees: "50",
      gallery: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      ],
    },
    {
      id: 4,
      title: "Winter Art Festival",
      date: "December 15-20, 2023",
      startDate: "2023-12-15",
      endDate: "2023-12-20",
      location: "City Plaza",
      description:
        "A magical winter celebration featuring ice sculptures, light installations, and interactive art experiences. Family-friendly event with activities for all ages.",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      category: "Festival",
      attendees: "1000+",
      gallery: [
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      ],
    },
    {
      id: 5,
      title: "Architecture Symposium",
      date: "November 8-10, 2023",
      startDate: "2023-11-08",
      endDate: "2023-11-10",
      location: "Design Institute",
      description:
        "Exploring the future of sustainable architecture and urban design. Presentations from leading architects and urban planners on innovative design solutions.",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      category: "Symposium",
      attendees: "200+",
      gallery: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      ],
    },
    {
      id: 6,
      title: "Tech & Art Fusion",
      date: "October 20, 2023",
      startDate: "2023-10-20",
      endDate: "2023-10-20",
      location: "Innovation Hub",
      description:
        "Exploring the intersection of technology and art through interactive installations, VR experiences, and AI-generated artwork demonstrations.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      category: "Exhibition",
      attendees: "150+",
      gallery: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      ],
    },
    // Added new future events for demonstration since current date is 2025
    {
      id: 7,
      title: "Autumn Design Expo 2025",
      date: "September 20-25, 2025",
      startDate: "2025-09-20",
      endDate: "2025-09-25",
      location: "Design Center",
      description:
        "An expo showcasing the latest in design trends, with exhibits from top designers and interactive sessions.",
      image:
        "https://images.unsplash.com/photo-1507146152569-19c0ab5b4d68?w=400&h=300&fit=crop",
      category: "Expo",
      attendees: "400+",
      gallery: [
        "https://images.unsplash.com/photo-1507146152569-19c0ab5b4d68?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      ],
    },
    {
      id: 8,
      title: "AI Art Symposium 2026",
      date: "January 15, 2026",
      startDate: "2026-01-15",
      endDate: "2026-01-15",
      location: "Tech Auditorium",
      description:
        "Discussing the role of AI in modern art, with panels and demonstrations from leading experts.",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      category: "Symposium",
      attendees: "250+",
      gallery: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      ],
    },
  ];

  // Dynamically compute upcoming and past events based on current date
  const now = new Date();
  let upcomingEvents = events
    .filter((event) => new Date(event.endDate) > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  let pastEvents = events
    .filter((event) => new Date(event.endDate) <= now)
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  // Apply category filter to upcoming events
  const categories = ["all", ...new Set(events.map((event) => event.category))];
  if (filterCategory !== "all") {
    upcomingEvents = upcomingEvents.filter(
      (event) => event.category === filterCategory
    );
  }

  // Dynamic statistics
  const totalEvents = events.length;
  const totalAttendees = events.reduce((sum, event) => {
    const num = parseInt(event.attendees.replace(/\D/g, ""), 10) || 0;
    return sum + num;
  }, 0);
  const featuredArtists = new Set(events.flatMap((event) => event.gallery))
    .size;

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
  }, []);

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
    alert("Subscribed successfully!");
  };

  // Register handler
  const handleRegister = () => {
    alert("Registered successfully!");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#010120] to-[#dddddd] text-white font-sans overflow-hidden"
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
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="event-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
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
                    <span className="mr-4">📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#D4AF37] font-medium">
                      {event.attendees} attendees
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
            {upcomingEvents.length === 0 && (
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
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
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
                    <span className="mr-4">📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#D4AF37] font-medium">
                      {event.attendees} attendees
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
              <div className="h-64 bg-gray-200">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }}
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
                        {selectedEvent.date}
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
                        <span className="w-24 font-medium">Attendees:</span>
                        {selectedEvent.attendees}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700">{selectedEvent.description}</p>
                  </div>
                </div>

                {/* Photo Gallery */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-4">
                    Photo Gallery
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedEvent.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="h-32 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x300?text=Image+Not+Found";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={
                      new Date(selectedEvent.endDate) > now
                        ? handleRegister
                        : () => alert("View full gallery (placeholder)")
                    }
                    className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors transform hover:-translate-y-1 duration-300"
                  >
                    {new Date(selectedEvent.endDate) > now
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
              { value: `${featuredArtists}+`, label: "Featured Images" },
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
