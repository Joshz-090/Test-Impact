import React from "react";
import missionImg from "../assets/images/VMV/mission.png";
import visionImg from "../assets/images/VMV/vision.png";
import valuesImg from "../assets/images/VMV/value.png";

export default function MissionVision() {
  const cards = [
    {
      title: "Mission",
      text: "Promote artistic excellence and community impact through accessible, high-quality creative work.",
      img: missionImg,
    },
    {
      title: "Vision",
      text: "A vibrant Ethiopia where creativity drives education, culture, and social progress.",
      img: visionImg,
    },
    {
      title: "Values",
      text: "Trusted delivery, original ideas, and modern tools—rooted in culture and purpose.",
      img: valuesImg,
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Animated Title */}
        <h2 className="relative text-4xl sm:text-5xl font-bold text-center mb-14 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text font-montserrat tracking-tight animate-float hover:animate-bounceSlow transition-all duration-300">
          About Us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative rounded-2xl bg-black/60 backdrop-blur-md shadow-md hover:shadow-2xl transition-all duration-500 p-6 text-center overflow-hidden"
            >
              {/* Animated Golden Gradient Overlay */}
              <div className="absolute inset-0 pointer-events-none before:content-[''] before:absolute before:w-[200%] before:h-[200%] before:bg-gradient-to-br before:from-yellow-400/20 before:to-transparent before:animate-goldenFlow mix-blend-soft-light"></div>

              {/* Image */}
              <div className="flex justify-center mb-5 relative z-10">
                <img
                  src={card.img}
                  alt={`${card.title} icon`}
                  loading="lazy"
                  className="w-36 h-36 sm:w-32 sm:h-32 object-contain transform transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_5px_10px_rgba(255,215,0,0.4)]"
                />
              </div>

              {/* Title */}
              <h3 className="relative z-10 text-xl sm:text-2xl font-semibold text-gray-100 mb-3 group-hover:text-yellow-500 transition-colors duration-300 font-montserrat">
                {card.title}
              </h3>

              {/* Text */}
              <p className="relative z-10 text-gray-400 text-sm sm:text-base leading-relaxed">
                {card.text}
              </p>

              {/* Hover Border */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-yellow-500/40 transition duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
