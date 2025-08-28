import React, { useState, useEffect, useRef } from "react";
import "./HomeComp4.css";

import eventImg from "../../assets/images/R/event.jpg";
import graphicImg from "../../assets/images/R/graphoc.jpg";
import artImg from "../../assets/images/R/art.jpg";
import arcImg from "../../assets/images/R/arc.jpg";
import webImg from "../../assets/images/R/web.jpg";
import brandImg from "../../assets/images/R/brand.jpg";

// Service data with fallback images
const services = [
  {
    title: "EVENT ORGANIZING & EXHIBITIONS",
    description:
      "Creating unique event concepts for exhibitions and art showcases, collaborating with young artists.",
    link: "LEARN MORE →",
    image: eventImg, // Replace with actual import: import eventImg from "../../assets/images/R/event.jpg"
  },
  {
    title: "GRAPHIC DESIGN & DIGITAL MARKETING",
    description:
      "Designing promotional materials and posters, with online, influencer, and direct marketing.",
    link: "LEARN MORE →",
    image: graphicImg, // Replace with actual import
  },
  {
    title: "ART WORKS & CONTENT CREATION",
    description:
      "Producing artist profiles, event descriptions, and hyper-realistic art with custom graphite drawings.",
    link: "LEARN MORE →",
    image: artImg, // Replace with actual import
  },
  {
    title: "ARCHITECTURAL & INTERIOR DESIGN",
    description:
      "Optimizing exhibition spaces with architectural design, feasibility studies, and interior design.",
    link: "LEARN MORE →",
    image: arcImg, // Replace with actual import
  },
  {
    title: "WEBSITE DESIGN & DEVELOPMENT",
    description:
      "Building websites with front-end/back-end development, UI design, and testing.",
    link: "LEARN MORE →",
    image: webImg, // Replace with actual import
  },
  {
    title: "BRAND STRATEGY & SOCIAL MEDIA",
    description:
      "Developing brand strategies and managing social media for art events and exhibitions.",
    link: "LEARN MORE →",
    image: brandImg, // Replace with actual import
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
      <h2 className="services-title">
        OUR <span>SERVICES</span>
      </h2>
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
