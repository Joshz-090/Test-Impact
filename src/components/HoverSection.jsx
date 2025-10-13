import { motion } from "framer-motion";
import { useState } from "react";

const HoverSection = ({ title, items }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="pb-1"
    >
      <motion.h5
        className="text-sm font-semibold text-gray-200 cursor-pointer leading-tight"
        whileHover={{ color: "#D4AF37", scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h5>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: hovered ? 1 : 0,
          height: hovered ? "auto" : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden text-gray-300 space-y-[2px] mt-[2px]"
      >
        {items.map((item, i) =>
          typeof item === "string" ? (
            <div key={i} className="flex items-center space-x-1 ml-4">
              <span className="text-[11px]">•</span>
              <span className="text-[12px]">{item}</span>
            </div>
          ) : (
            <a
              key={i}
              href={item.link}
              className="flex items-center space-x-1 hover:text-[#D4AF37] transition duration-300 ml-4"
            >
              <span className="text-[11px]">•</span>
              <span className="text-[12px]">{item.label}</span>
            </a>
          )
        )}
      </motion.div>
    </div>
  );
};

export default HoverSection;
