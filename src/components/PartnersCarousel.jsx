import React, { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useReducedMotion } from "framer-motion";

import partner1 from "../assets/images/partner/Abogida.png";
import partner2 from "../assets/images/partner/all-God.png";
import partner3 from "../assets/images/partner/Bethel.png";
import partner4 from "../assets/images/partner/CoSAP.png";
import partner5 from "../assets/images/partner/Delasalle.png";
import partner6 from "../assets/images/partner/markonal.png";
import partner7 from "../assets/images/partner/Painters-and-Sculptors.png";
import partner8 from "../assets/images/partner/s.png";
import partner9 from "../assets/images/partner/Simple-Restaorant.png";
import partner10 from "../assets/images/partner/tsehay.png";
import partner11 from "../assets/images/partner/visual.png";

const defaultLogos = [
  {
    src: partner1,
    alt: "Partner 1",
    href: "#",
  },
  {
    src: partner2,
    alt: "Partner 2",
    href: "#",
  },
  {
    src: partner3,
    alt: "Partner 3",
    href: "#",
  },
  {
    src: partner4,
    alt: "Partner 4",
    href: "#",
  },
  {
    src: partner5,
    alt: "Partner 5",
    href: "#",
  },
  {
    src: partner6,
    alt: "Partner 6",
    href: "#",
  },
  {
    src: partner7,
    alt: "Partner 7",
    href: "#",
  },
  {
    src: partner8,
    alt: "Partner 8",
    href: "#",
  },
  {
    src: partner9,
    alt: "Partner 9",
    href: "#",
  },
  {
    src: partner10,
    alt: "Partner 10",
    href: "#",
  },
  {
    src: partner11,
    alt: "Partner 11",
    href: "#",
  },
];

const Chevron = ({ direction = "left" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {direction === "left" ? (
      <path d="M15 18l-6-6 6-6" />
    ) : (
      <path d="M9 18l6-6-6-6" />
    )}
  </svg>
);

const PartnersCarousel = React.memo(function PartnersCarousel({
  logos,
  autoplayDelay = 3000,
  className = "",
}) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      dragFree: true,
      skipSnaps: false,
      containScroll: "trimSnaps",
    },
    prefersReducedMotion ? [] : [Autoplay({ delay: autoplayDelay })]
  );

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const slides = useMemo(() => (logos?.length ? logos : defaultLogos), [logos]);

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.style.display = "none";
    e.target.nextSibling.style.display = "block";
  };

  return (
    <section
      aria-label="Partners Carousel"
      className={`relative mx-auto w-full select-none ${className} bg-black`}
    >
      {/* Header */}
      <div className="text-center mb-10 pt-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-['Montserrat'] uppercase tracking-wider">
          Our <span className="text-[#D4AF37]">Partners</span>
        </h2>
        <p className="text-gray-400 text-base">
          Trusted by leading organizations across Ethiopia
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-106 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-106 bg-gradient-to-l from-black to-transparent" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {slides.map((logo, idx) => (
              <motion.div
                key={`${logo.alt}-${idx}`}
                className="min-w-0 shrink-0 basis-1/3 px-3 md:basis-1/4 lg:basis-1/7"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block rounded-2xl bg-white/20 pt-4 pb-4 ring-1 ring-slate-200 backdrop-blur transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:ring-slate-800"
                  aria-label={`Visit ${logo.alt}'s website`}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    animate={{
                      scale: idx === selectedIndex ? 1.05 : 0.95,
                      opacity: idx === selectedIndex ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      loading="lazy"
                      decoding="async"
                      width={300}
                      height={120}
                      sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 14vw"
                      className="mx-auto h-12 w-auto object-contain transition duration-300 md:h-14 xl:h-16"
                      onError={handleImageError}
                      style={{
                        filter:
                          idx === selectedIndex ? "none" : "grayscale(100%)",
                      }}
                    />
                    <div className="mx-auto hidden h-12 w-full items-center justify-center rounded bg-gray-100 text-xs text-gray-500 md:h-14 xl:h-16">
                      {logo.alt}
                    </div>
                  </motion.div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination dots - visible on both mobile and desktop */}
      {scrollSnaps.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to partner ${index + 3}`}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-[#D4AF37] scale-130"
                    : "bg-gray-500"
                }`}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
});

export default PartnersCarousel;
