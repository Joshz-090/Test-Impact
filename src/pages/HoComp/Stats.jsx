import React, { useState, useEffect, useRef } from "react";
import "./Stats.css";

const Stats = ({
  primaryColor,
  textColor,
  lightBg,
  headline,
  stats,
  backgroundImage,
}) => {
  const [displayValues, setDisplayValues] = useState(
    stats.map((stat) => stat.number)
  );
  const statsRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Convert display numbers to numeric values
  const getNumericValue = (value) => {
    if (value.includes("K+")) return parseInt(value) * 1000;
    if (value.includes("+")) return parseInt(value);
    return parseInt(value) || 0;
  };

  // Format back to original display format
  const formatDisplayValue = (value, original) => {
    if (original.includes("K+")) return `${Math.floor(value / 1000)} K+`;
    if (original.includes("+")) return `${Math.floor(value)}+`;
    return Math.floor(value);
  };

  // Fast exponential easing function for snappy animation
  const easeOutExpo = (t) => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  };

  const animateNumbers = () => {
    const duration = 800; // Reduced from 2000ms to 800ms for faster animation
    const startTime = performance.now();
    const targetValues = stats.map((stat) => getNumericValue(stat.number));

    const updateCounts = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const newDisplayValues = stats.map((stat, index) => {
        const currentValue = easedProgress * targetValues[index];
        return formatDisplayValue(currentValue, stat.number);
      });

      setDisplayValues(newDisplayValues);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateCounts);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateCounts);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Cancel any existing animation
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            // Reset to 0 and start animation
            setDisplayValues(
              stats.map((stat) =>
                stat.number.includes("K+")
                  ? "0 K+"
                  : stat.number.includes("+")
                  ? "0+"
                  : "0"
              )
            );
            animateNumbers();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [stats]);

  return (
    <div
      className="stats-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      ref={statsRef}
    >
      <div
        className="stats-container"
        style={{
          "--primary-color": primaryColor,
          "--text-color": textColor,
          "--light-bg": lightBg,
        }}
      >
        <div className="stats-header">
          <h2>{headline}</h2>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{displayValues[index]}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
