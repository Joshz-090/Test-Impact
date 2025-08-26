import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaPaintBrush,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaGlobeAfrica,
  FaLeaf,
} from "react-icons/fa";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Hardcoded values array
const defaultValues = [
  {
    title: "Artistic Excellence",
    description: "Highest standards of creative expression",
    icon: <FaPaintBrush className="text-3xl md:text-4xl" />,
  },
  {
    title: "Youth Empowerment",
    description: "Nurturing next-gen Ethiopian creatives",
    icon: <FaUsers className="text-3xl md:text-4xl" />,
  },
  {
    title: "Innovation",
    description: "Blending tradition with technology",
    icon: <FaLightbulb className="text-3xl md:text-4xl" />,
  },
  {
    title: "Community First",
    description: "Projects with measurable social benefit",
    icon: <FaHandshake className="text-3xl md:text-4xl" />,
  },
  {
    title: "Cultural Legacy",
    description: "Preserving Ethiopian heritage",
    icon: <FaGlobeAfrica className="text-3xl md:text-4xl" />,
  },
  {
    title: "Sustainability",
    description: "Eco-conscious creative practice",
    icon: <FaLeaf className="text-3xl md:text-4xl" />,
  },
];

const ValuesSection = ({ values = defaultValues }) => {
  const sectionRef = useRef(null);

  // Debug log to verify values
  console.log("ValuesSection: values =", values);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate value cards
      gsap.utils.toArray(".value-card").forEach((card, i) => {
        // Scroll-triggered animation for each card
        gsap.from(card, {
          y: 40,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        // Animate title and description within each card
        gsap.from(card.querySelector(".value-title"), {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: i * 0.1 + 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        gsap.from(card.querySelector(".value-description"), {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: i * 0.1 + 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        // Hover/touch animations for desktop and mobile
        const handleEnter = () => {
          gsap.to(card, {
            scale: 1.03,
            boxShadow: "0 10px 20px rgba(212, 175, 55, 0.3)",
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(card.querySelector(".value-icon"), {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            scale: 1,
            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(card.querySelector(".value-icon"), {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("touchstart", handleEnter);
        card.addEventListener("mouseleave", handleLeave);
        card.addEventListener("touchend", handleLeave);

        // Cleanup event listeners
        return () => {
          card.removeEventListener("mouseenter", handleEnter);
          card.removeEventListener("touchstart", handleEnter);
          card.removeEventListener("mouseleave", handleLeave);
          card.removeEventListener("touchend", handleLeave);
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Simplified condition: only check if values is empty
  if (values.length === 0) {
    console.log("ValuesSection: Rendering fallback UI because values is empty");
    return (
      <section
        ref={sectionRef}
        className="py-12 md:py-20 section-reveal bg-gray-900/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 font-montserrat">
            Our <span className="text-[#D4AF37]">Creative DNA</span>
          </h2>
          <p className="text-center text-gray-300">
            No values available to display.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-20 section-reveal bg-gray-900/30 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 font-montserrat">
          Our <span className="text-[#D4AF37]">Creative DNA</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="value-card bg-black/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-500 group relative overflow-hidden will-change-transform"
              aria-label={`Value: ${value.title}`}
            >
              {/* Background shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/15 to-[#D4AF37]/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>

              {/* Icon container */}
              <div className="value-icon bg-[#D4AF37]/20 p-3 md:p-4 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6 relative z-10">
                {value.icon}
              </div>

              <h3 className="value-title text-lg md:text-xl font-bold mb-2 md:mb-3 font-montserrat relative z-10">
                {value.title}
              </h3>
              <p className="value-description text-sm md:text-base text-gray-300 relative z-10">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
