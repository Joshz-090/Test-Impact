import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const TimelineAnimation = () => {
  useEffect(() => {
    // Function to set up animations based on screen size
    const setupAnimations = () => {
      const isMobile = window.innerWidth < 768;

      gsap.utils.toArray(".timeline-item").forEach((item, i) => {
        // Clear previous animations to prevent conflicts
        gsap.killTweensOf(item);

        if (isMobile) {
          // Mobile animation: slide in from left
          gsap.from(item, {
            x: -60,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        } else {
          // Desktop animation: alternate sides with slight rotation
          gsap.from(item, {
            x: i % 2 === 0 ? -120 : 120,
            opacity: 0,
            rotationY: i % 2 === 0 ? -20 : 20,
            duration: 1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    };

    // Run animations on mount
    setupAnimations();

    // Re-run animations on window resize
    window.addEventListener("resize", setupAnimations);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", setupAnimations);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
};

export default TimelineAnimation;
