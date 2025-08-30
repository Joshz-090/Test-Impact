import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LearnMoreButton = ({ id }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/learnmore/${id}`);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="mt-6 w-full bg-[#D4AF37] text-black py-3 px-6 rounded-lg font-semibold font-['Montserrat'] transition-all duration-300"
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 15px rgba(212, 175, 55, 0.5)",
        backgroundColor: "#B8941F",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      Learn More
    </motion.button>
  );
};

export default LearnMoreButton;
