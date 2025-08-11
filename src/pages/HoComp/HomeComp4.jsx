import React, { useState, useEffect, useRef } from "react";
import "./HomeComp4.css";

// Import your service images
import eventImg from "../../assets/images/event.jpg";
import designImg from "../../assets/images/content.jpg";
import webImg from "../../assets/images/event.jpg";
import brandImg from "../../assets/images/content.jpg";
import contentImg from "../../assets/images/event.jpg";
import socialImg from "../../assets/images/content.jpg";

const services = [
  {
    title: "EVENT ORGANIZING & EXHIBITIONS",
    description:
      "From concept to execution, we create memorable events and exhibitions that showcase creativity and foster community engagement.",
    link: "LEARN MORE →",
    image: eventImg,
  },
  {
    title: "GRAPHIC DESIGN & DIGITAL MARKETING",
    description:
      "We create compelling visual identities and implement strategic digital marketing campaigns that help brands stand out.",
    link: "LEARN MORE →",
    image: designImg,
  },
  {
    title: "WEB & APP DEVELOPMENT",
    description:
      "We build responsive websites and intuitive applications that deliver exceptional user experiences and drive business growth.",
    link: "LEARN MORE →",
    image: webImg,
  },
  {
    title: "BRAND STRATEGY",
    description:
      "We develop comprehensive brand strategies that align with your business goals and resonate with your target audience.",
    link: "LEARN MORE →",
    image: brandImg,
  },
  {
    title: "CONTENT CREATION",
    description:
      "Our team produces engaging content that tells your story and connects with your customers on multiple platforms.",
    link: "LEARN MORE →",
    image: contentImg,
  },
  {
    title: "SOCIAL MEDIA MANAGEMENT",
    description:
      "We manage and optimize your social media presence to increase engagement and grow your online community.",
    link: "LEARN MORE →",
    image: socialImg,
  },
];

const HomeComp4 = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
      startTimer();
    }, 8000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    resetTimer();
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % services.length);
    resetTimer();
  };

  const handleCardClick = (index) => {
    setActiveIndex(index);
    resetTimer();
  };

  const resetTimer = () => {
    clearTimer();
    startTimer();
  };

  const getCardPosition = (index) => {
    const positions = [
      "left",
      "center",
      "right",
      "overflow-right",
      "overflow-left",
    ];
    const relativeIndex =
      (index - activeIndex + services.length) % services.length;

    if (relativeIndex === 0) return positions[1]; // Center
    if (relativeIndex === 1) return positions[2]; // Right
    if (relativeIndex === services.length - 1) return positions[0]; // Left
    if (relativeIndex > 2 && relativeIndex < services.length - 1)
      return positions[3]; // Overflow right
    return positions[3]; // Default to overflow right
  };

  return (
    <div className="services-container">
      <h2 className="services-title">OUR SERVICES</h2>
      <p className="services-subtitle">
        We offer a comprehensive range of creative services to help
        organizations and individuals make a meaningful impact.
      </p>

      <div className="services-carousel-container">
        <div className="services-carousel">
          {services.map((service, index) => {
            const position = getCardPosition(index);

            // Only render the center card on mobile
            // (CSS will hide others, but for accessibility, only render center on mobile)
            return (
              <div
                key={index}
                className={`service-card ${position}`}
                onClick={() => handleCardClick(index)}
                aria-hidden={position !== "center"}
                tabIndex={position === "center" ? 0 : -1}
              >
                <div className="card-image-container">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="card-image"
                    loading="lazy"
                  />
                </div>
                <div className="card-text-container">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#" className="learn-more">
                    {service.link}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        <div className="carousel-nav-buttons">
          <button
            className="nav-button prev"
            onClick={handlePrev}
            aria-label="Previous Service"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
            </svg>
          </button>
          <button
            className="nav-button next"
            onClick={handleNext}
            aria-label="Next Service"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeComp4;
