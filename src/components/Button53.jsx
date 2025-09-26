import React from "react";
import { useNavigate } from "react-router-dom";

const Button53 = ({ text = "Button", link = "#", onClick, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (link && link !== "#") {
      if (link.startsWith("http") || link.startsWith("https")) {
        window.open(link, "_blank"); // External URLs open in a new tab
      } else {
        navigate(link); // Internal routes use React Router
      }
    }
  };

  // Split text into individual characters, preserving spaces
  const letters = text.split("");

  return (
    <div className={className}>
      <button className="btn-53" onClick={handleClick}>
        <div className="original">{text}</div>
        <div className="letters">
          {letters.map((letter, index) => (
            <span key={index} className={letter === " " ? "space" : ""}>
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>
      </button>
    </div>
  );
};

export default Button53;
