import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import Button53 from "../../components/Button53";
import { useIsMobile } from "../../components/useIsMobile";

const HeroSection = () => {
  const isMobile = useIsMobile(768);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      clearTimeout(timer);
    };
  }, []);

  const scrollToNextSection = () => {
    const el = document.getElementById("pre-About");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const AnimatedButton = () => {
    return (
      <button
        aria-label="Scroll to next section"
        onClick={scrollToNextSection}
        className="cta-buttona group"
      >
        <span className="second2">
          <svg width="50px" height="30px" viewBox="0 0 43 66" version="1.1">
            <g
              id="arrow"
              stroke="none"
              strokeWidth={1}
              fill="none"
              fillRule="evenodd"
            >
              <path
                className="one1"
                d="M3.89485454,40.1543933 L0.139296592,43.9763149 C-0.0518420739,44.1708311 -0.0518571125,44.4826329 0.139262789,44.6771675 L20.7848311,65.6916134 C21.1718824,66.0855801 21.8050225,66.0911863 22.1989893,65.704135 C22.2031791,65.7000188 22.2073326,65.6958657 22.2114492,65.6916762 L42.8607841,44.677098 C43.0519059,44.4825957 43.0519358,44.1708242 42.8608513,43.9762853 L39.1069479,40.1545186 C38.9134427,39.9575152 38.5968729,39.9546793 38.3998695,40.1481845 C38.3977268,40.1502893 38.395603,40.1524132 38.3934985,40.1545562 L21.8567812,56.9937789 C21.6632968,57.1908028 21.3467273,57.193672 21.1497035,57.0001876 C21.1475418,56.9980647 21.1453995,56.9959223 21.1432767,56.9937605 L4.60825197,40.1545208 C4.41477773,39.9574869 4.09820839,39.9546013 3.90117456,40.1480756 C3.89904911,40.1501626 3.89694235,40.1522686 3.89485454,40.1543933 Z"
                fill="#FFFFFF"
              />
              <path
                className="two2"
                d="M3.89485454,20.1543933 L0.139296592,23.9763149 C-0.0518420739,24.1708311 -0.0518571125,24.4826329 0.139262789,24.6771675 L20.7848311,45.6916134 C21.1718824,46.0855801 21.8050225,46.0911863 22.1989893,45.704135 C22.2031791,45.7000188 22.2073326,45.6958657 22.2114492,45.6916762 L42.8607841,24.677098 C43.0519059,24.4825957 43.0519358,24.1708242 42.8608513,23.9762853 L39.1069479,20.1545186 C38.9134427,19.9575152 38.5968729,19.9546793 38.3998695,20.1481845 C38.3977268,20.1502893 38.395603,20.1524132 38.3934985,20.1545562 L21.8567812,36.9937789 C21.6632968,37.1908028 21.3467273,37.193672 21.1497035,37.0001876 C21.1475418,36.9980647 21.1453995,36.9959223 21.1432767,36.9937605 L4.60825197,20.1545208 C4.41477773,19.9574869 4.09820839,19.9546013 3.90117456,20.1480756 C3.89904911,20.1501626 3.89694235,20.1522686 3.89485454,20.1543933 Z"
                fill="#FFFFFF"
              />
              <path
                className="three3"
                d="M3.89485454,0.154393339 L0.139296592,3.97631488 C-0.0518420739,4.17083111 -0.0518571125,4.48263286 0.139262789,4.67716753 L20.7848311,25.6916134 C21.1718824,26.0855801 21.8050225,26.0911863 22.1989893,25.704135 C22.2031791,25.7000188 22.2073326,25.6958657 22.2114492,25.6916762 L42.8607841,4.67709797 C43.0519059,4.48259567 43.0519358,4.17082418 42.8608513,3.97628526 L39.1069479,0.154518591 C38.9134427,-0.0424848215 38.5968729,-0.0453206733 38.3998695,0.148184538 C38.3977268,0.150289256 38.395603,0.152413239 38.3934985,0.154556228 L21.8567812,16.9937789 C21.6632968,17.1908028 21.3467273,17.193672 21.1497035,17.0001876 C21.1475418,16.9980647 21.1453995,16.9959223 21.1432767,16.9937605 L4.60825197,0.15452076 C4.41477773,-0.0425130651 4.09820839,-0.0453986756 3.90117456,0.148075568 C3.89904911,0.150162624 3.89694235,0.152268631 3.89485454,0.154393339 Z"
                fill="#FFFFFF"
              />
            </g>
          </svg>
        </span>
      </button>
    );
  };

  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop";

  const desktopSrc =
    "https://www.youtube.com/embed/TM7MU3g67sE?autoplay=1&mute=1&loop=1&playlist=TM7MU3g67sE&controls=0&modestbranding=1";
  const mobileSrc =
    "https://www.youtube.com/embed/Kx2ecBFUdH0?autoplay=1&mute=1&loop=1&playlist=Kx2ecBFUdH0&controls=0&modestbranding=1";

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-center hero-section"
      role="banner"
      aria-label="Hero section with video background"
    >
      {/* Video backgrounds */}
      {!prefersReducedMotion && (
        <iframe
          className="absolute inset-0 w-full h-full object-cover"
          src={isMobile ? mobileSrc : desktopSrc}
          title="Hero video background"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          aria-hidden="true"
        />
      )}

      {/* Static fallback */}
      {prefersReducedMotion && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${fallbackImageUrl})` }}
          role="img"
          aria-label="Hero background image"
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[rgba(10,30,90,0.7)] to-[rgba(0,0,0,0.95)]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="hero-headline text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-shadow-[0_4px_12px_rgba(0,0,0,0.5)] font-['Montserrat']">
          Elevate Your Vision with{" "}
          <span className="relative inline-block group cursor-pointer">
            {/* Styling span content */}
          </span>
        </h1>
        <p
          className={`text-[0.8rem] sm:text-[1rem] lg:text-[1.2rem] max-w-[850px] mx-auto leading-[1.6] mb-9 italic transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          id="hero-description"
        >
          Where artistic excellence meets innovative event curation — crafting
          immersive experiences that inspire communities and amplify brands.
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button
            text="Explore Our Work"
            onClick={() => {}}
            className="transform hover:scale-105 transition-transform"
          />
          <Button53
            text="Start Your Project"
            className="transform hover:scale-105 transition-transform"
          />
        </div>
        <AnimatedButton />
      </div>
    </section>
  );
};

export default HeroSection;
