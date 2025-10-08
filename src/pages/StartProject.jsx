import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const StartProject = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeField, setActiveField] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    departments: [],
    details: "",
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        departments: checked
          ? [...prev.departments, value]
          : prev.departments.filter((dep) => dep !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "projects"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      if (formRef.current) {
        formRef.current.classList.add("submit-success");
        setTimeout(() => {
          navigate("/thank-you");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      setIsSubmitting(false);
      if (formRef.current) {
        formRef.current.classList.add("submit-error");
        setTimeout(() => {
          formRef.current.classList.remove("submit-error");
        }, 3000);
      }
    }
  };

  const floatingShapes = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    size: Math.random() * 50 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 12 + 8,
  }));

  return (
    <div className="min-h-screen bg-[#cccccc] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingShapes.map((shape) => (
          <div
            key={shape.id}
            className="floating-shape absolute rounded-full bg-black/10 backdrop-blur-sm"
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`,
              transform: `rotate3d(${mousePosition.x}, ${mousePosition.y}, 0, 30deg)`,
            }}
          />
        ))}
      </div>

      {/* Subtle Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: `perspective(1000px) rotateX(${
            mousePosition.y * 3
          }deg) rotateY(${mousePosition.x * 3}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div
          ref={formRef}
          className="max-w-2xl w-full space-y-8 transform-gpu"
          style={{
            transform: `perspective(1000px) rotateX(${
              mousePosition.y * 1.5
            }deg) rotateY(${mousePosition.x * 1.5}deg) scale3d(1, 1, 1)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div className="text-center relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-black/5 to-gold/10 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-black relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-[#D4AF37]">
                Start Your Project
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-700 max-w-lg mx-auto leading-relaxed">
              Collaborate with our expert teams in{" "}
              <span className="text-gold font-semibold">
                IT, Graphic Design, Design, and Marketing
              </span>{" "}
              to bring your vision to life.
            </p>
            <div className="mt-3 text-black font-medium text-lg animate-pulse">
              Contact us at: +251953454460
            </div>
          </div>

          {/* Form Container */}
          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-[#eeeeee] backdrop-blur-lg p-8 rounded-2xl border border-gold/20 shadow-2xl relative overflow-hidden"
            style={{
              transform: `perspective(1000px) rotateX(${
                mousePosition.y * 0.5
              }deg) rotateY(${mousePosition.x * 0.5}deg) translateZ(20px)`,
              boxShadow: `
                0 15px 30px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.6),
                ${mousePosition.x * 5}px ${
                mousePosition.y * 5
              }px 20px rgba(255, 215, 0, 0.15)
              `,
            }}
          >
            {/* Form Glow Effect */}
            <div
              className="absolute -inset-4 bg-gradient-to-r from-gold/10 to-transparent rounded-2xl blur-xl opacity-40"
              style={{
                transform: `translateX(${mousePosition.x * 15}px) translateY(${
                  mousePosition.y * 15
                }px)`,
              }}
            />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {/* Name Field */}
              <div className="md:col-span-2">
                <FloatingLabel
                  id="name"
                  label="Your Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setActiveField("name")}
                  onBlur={() => setActiveField(null)}
                  isActive={activeField === "name"}
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <FloatingLabel
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setActiveField("email")}
                  onBlur={() => setActiveField(null)}
                  isActive={activeField === "email"}
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <FloatingLabel
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setActiveField("phone")}
                  onBlur={() => setActiveField(null)}
                  isActive={activeField === "phone"}
                  required
                />
              </div>

              {/* Event Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gold mb-2 ml-1">
                  Event Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "corporate", label: "Corporate", emoji: "🏢" },
                    { value: "wedding", label: "Wedding", emoji: "💒" },
                    { value: "conference", label: "Conference", emoji: "🎤" },
                    { value: "other", label: "Other", emoji: "✨" },
                  ].map((event) => (
                    <button
                      key={event.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          eventType: event.value,
                        }))
                      }
                      className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                        formData.eventType === event.value
                          ? "border-gold bg-gold/20 text-black shadow-md shadow-gold/30"
                          : "border-gray-300 bg-gray-100 text-gray-700 hover:border-gold/50"
                      }`}
                    >
                      <div className="text-xl mb-1">{event.emoji}</div>
                      <div className="text-sm font-medium">{event.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Departments */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gold mb-2 ml-1">
                  Departments Needed
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "IT", icon: "💻" },
                    { value: "Graphic Design", icon: "🎨" },
                    { value: "Design", icon: "✏️" },
                    { value: "Marketing", icon: "📈" },
                  ].map((dep) => (
                    <label
                      key={dep.value}
                      className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                        formData.departments.includes(dep.value)
                          ? "checked"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="departments"
                        value={dep.value}
                        checked={formData.departments.includes(dep.value)}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          formData.departments.includes(dep.value)
                            ? "border-gold bg-gold/20 text-black shadow-md shadow-gold/30"
                            : "border-gray-300 bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div className="text-xl mb-2">{dep.icon}</div>
                        <div className="text-sm font-medium text-center">
                          {dep.value}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gold mb-2 ml-1">
                  Project Details
                </label>
                <div className="relative">
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    onFocus={() => setActiveField("details")}
                    onBlur={() => setActiveField(null)}
                    className="w-full h-28 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 resize-none"
                    placeholder="Tell us about your project or event..."
                    style={{
                      transform:
                        activeField === "details"
                          ? "translateZ(8px)"
                          : "translateZ(0)",
                    }}
                  />
                  <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
                    {formData.details.length}/500
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4 relative z-10">
              <HolographicButton
                type="submit"
                disabled={isSubmitting}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gold rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-r from-gold to-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative px-8 py-3 text-black font-semibold text-lg tracking-wide">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    "Launch Project 🚀"
                  )}
                </div>
              </HolographicButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Floating Label Input Component
const FloatingLabel = ({
  id,
  label,
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  isActive,
  required,
}) => {
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value.length > 0);
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={(e) => {
            onChange(e);
            setHasValue(e.target.value.length > 0);
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          required={required}
          className="w-full px-4 py-3 bg-white rounded-lg text-black placeholder-transparent focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all duration-300 peer border border-gray-300"
          placeholder={label}
          style={{
            transform: isActive ? "translateZ(8px)" : "translateZ(0)",
          }}
        />
        <div
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-black to-gold transition-all duration-300 ${
            isActive ? "opacity-100 scale-100" : "opacity-50 scale-95"
          }`}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-300 pointer-events-none ${
            hasValue || isActive
              ? "top-0.5 text-gold text-xs font-medium transform -translate-y-2 bg-white px-1 rounded"
              : "top-3 text-gray-600 text-sm"
          } ${isActive ? "text-gold" : ""}`}
        >
          {label}
          {required && <span className="text-gold ml-1">*</span>}
        </label>
      </div>
    </div>
  );
};

// Holographic Button Component
const HolographicButton = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="relative overflow-hidden group transform transition-transform duration-300 hover:scale-105"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-white to-gold rounded-lg blur-sm opacity-60 group-hover:opacity-100 group-hover:blur-md transition-all duration-300" />
      <div className="relative bg-gradient-to-r from-white to-gold rounded-lg shadow-lg group-hover:shadow-gold/30 transition-all duration-300">
        {children}
      </div>
    </button>
  );
};

export default StartProject;
