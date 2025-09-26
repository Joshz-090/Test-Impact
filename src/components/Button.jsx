import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ text = "Button", link = "#", onClick, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (link && link !== "#") {
      // Check if the link is an external URL (starts with http or https)
      if (link.startsWith("http") || link.startsWith("https")) {
        window.open(link, "_blank");
      } else {
        // Use navigate for internal routes
        navigate(link);
      }
    }
  };

  return (
    <div className={className}>
      <button className="btn-17" onClick={handleClick}>
        <span className="text-container">
          <span className="text">{text}</span>
        </span>
      </button>
    </div>
  );
};

export default Button;
