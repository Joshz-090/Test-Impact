import React, { useState, useEffect, useRef } from "react";

const TestimonialsSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const [centeredCardId, setCenteredCardId] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  // Sample testimonials data - you can replace with real data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Event Coordinator",
      company: "Art Gallery Hub",
      content:
        "Impact Production transformed our art exhibition into an unforgettable experience. Their attention to detail and creative vision exceeded all our expectations.",
      rating: 5,
      photo:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Marketing Director",
      company: "Creative Solutions Inc.",
      content:
        "Working with Impact Production was a game-changer for our brand. Their graphic design and digital marketing strategies brought our vision to life.",
      rating: 5,
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Community Manager",
      company: "Youth Development NGO",
      content:
        "The team's dedication to community impact is inspiring. They helped us create meaningful programs that truly make a difference in young people's lives.",
      rating: 5,
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "David Thompson",
      role: "CEO",
      company: "TechStart Ventures",
      content:
        "Professional, innovative, and results-driven. Impact Production delivered our website and branding solutions that perfectly captured our company's essence.",
      rating: 5,
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Art Director",
      company: "Metropolitan Arts Center",
      content:
        "Their architectural design expertise helped us optimize our exhibition spaces beautifully. The attention to both aesthetics and functionality was remarkable.",
      rating: 5,
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Founder",
      company: "Social Impact Foundation",
      content:
        "Impact Production doesn't just deliver services; they create lasting impact. Their commitment to social causes shines through in everything they do.",
      rating: 5,
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  // Duplicate testimonials for seamless scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      // Find all testimonial cards and check if any author info is near center
      const testimonialCards = section.querySelectorAll(".testimonial-card");
      let shouldStop = false;
      let closestCardId = null;
      let closestDistance = Infinity;

      testimonialCards.forEach((card, index) => {
        // Find the author info element within this card
        const authorInfo = card.querySelector(".flex.items-center");
        if (authorInfo) {
          const authorRect = authorInfo.getBoundingClientRect();

          // Check if author info is near the center of viewport
          const authorCenter = authorRect.top + authorRect.height / 2;
          const distanceFromCenter = Math.abs(authorCenter - viewportCenter);

          // Track the closest card to center
          if (distanceFromCenter < closestDistance) {
            closestDistance = distanceFromCenter;
            closestCardId = index;
          }

          // Stop if author info is within 100px of viewport center
          if (distanceFromCenter <= 100) {
            shouldStop = true;
          }
        }
      });

      setCenteredCardId(closestCardId);
      setHasScrolledEnough(shouldStop);
      setIsPaused(shouldStop);
    };

    // Create intersection observer to detect when section is in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener("scroll", handleScroll, { passive: true });
            handleScroll(); // Initial check
          } else {
            window.removeEventListener("scroll", handleScroll);
            setIsPaused(false);
            setHasScrolledEnough(false);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    if (sectionRef.current) {
      observerRef.current.observe(sectionRef.current);
    }

    // Initial check in case component loads already in view
    setTimeout(() => handleScroll(), 100);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section
      ref={sectionRef}
      className="testimonials-section py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-['Montserrat'] uppercase tracking-wider">
            What People Say{" "}
            <span className="text-gradient bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              About Us
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Hear from our clients and partners about their experience working
            with Impact Production
          </p>
        </div>

        {/* Testimonials Marquee */}
        <div className="relative">
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-20 pointer-events-none"></div>

          <div
            className="flex space-x-6 animate-marquee"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
              animationDuration: "30s",
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className={`testimonial-card flex-shrink-0 w-80 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:bg-white/15 group ${
                  centeredCardId === index
                    ? "bg-white/20 border-yellow-400/70 shadow-lg shadow-yellow-400/20"
                    : "bg-white/10 border-white/20 hover:border-yellow-400/50"
                }`}
              >
                {/* Rating Stars */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-gray-200 text-sm leading-relaxed mb-6 group-hover:text-white transition-colors">
                  "{testimonial.content}"
                </blockquote>

                {/* Author Info */}
                <div
                  className={`flex items-center transition-all duration-300 ${
                    centeredCardId === index ? "transform scale-105" : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg mr-4 transition-all duration-300 overflow-hidden ${
                      centeredCardId === index
                        ? "ring-2 ring-yellow-400/50 shadow-lg"
                        : ""
                    } ${
                      testimonial.photo &&
                      !imageErrors.has(`${testimonial.id}-${index}`)
                        ? "bg-gray-200"
                        : "bg-gradient-to-br from-yellow-400 to-yellow-600"
                    }`}
                  >
                    {testimonial.photo &&
                    !imageErrors.has(`${testimonial.id}-${index}`) ? (
                      <img
                        src={testimonial.photo}
                        alt={`${testimonial.name} profile`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={() => {
                          setImageErrors(
                            (prev) =>
                              new Set([...prev, `${testimonial.id}-${index}`])
                          );
                        }}
                      />
                    ) : null}
                    <span
                      className={`${
                        testimonial.photo &&
                        !imageErrors.has(`${testimonial.id}-${index}`)
                          ? "hidden"
                          : "flex"
                      } items-center justify-center w-full h-full`}
                    >
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4
                      className={`font-semibold text-sm font-['Montserrat'] transition-colors duration-300 ${
                        centeredCardId === index
                          ? "text-yellow-300"
                          : "text-white"
                      }`}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className={`text-xs transition-colors duration-300 ${
                        centeredCardId === index
                          ? "text-yellow-200"
                          : "text-gray-400"
                      }`}
                    >
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                hasScrolledEnough
                  ? "bg-green-400"
                  : isPaused
                  ? "bg-yellow-400"
                  : "bg-gray-500"
              }`}
            ></div>
            <span className="font-['Montserrat']">
              {hasScrolledEnough ? " " : isPaused ? "Paused" : " "}
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            You can take part in this section by contacting us.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
