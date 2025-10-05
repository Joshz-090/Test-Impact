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

  const floatingShapes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingShapes.map((shape) => (
          <div
            key={shape.id}
            className="floating-shape absolute rounded-full bg-gradient-to-r from-yellow-400/10 to-amber-600/10 backdrop-blur-sm"
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              animationDelay: `${shape.delay}s`,
              animationDuration: `${shape.duration}s`,
              transform: `rotate3d(${mousePosition.x}, ${mousePosition.y}, 0, 45deg)`,
            }}
          />
        ))}
      </div>

      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          transform: `perspective(1000px) rotateX(${
            mousePosition.y * 5
          }deg) rotateY(${mousePosition.x * 5}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div
          ref={formRef}
          className="max-w-3xl w-full space-y-8 transform-gpu"
          style={{
            transform: `perspective(1000px) rotateX(${
              mousePosition.y * 2
            }deg) rotateY(${mousePosition.x * 2}deg) scale3d(1, 1, 1)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          {/* Animated Header */}
          <div className="text-center relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/20 to-yellow-600/20 rounded-2xl blur-xl opacity-75 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold text-white relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 animate-gradient-x">
                Start Your Project
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Let's bring your event or project to life! Collaborate with our
              expert teams in
              <span className="text-amber-300 font-semibold">
                {" "}
                IT, Graphic Design, Design, and Marketing
              </span>
              .
            </p>
            <div className="mt-4 text-amber-300 font-semibold text-xl animate-bounce">
              Contact us at: +251953454460
            </div>
          </div>

          {/* 3D Form Container */}
          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden"
            style={{
              transform: `perspective(1000px) rotateX(${
                mousePosition.y * 1
              }deg) rotateY(${mousePosition.x * 1}deg) translateZ(20px)`,
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                ${mousePosition.x * 10}px ${
                mousePosition.y * 10
              }px 30px rgba(212, 175, 55, 0.2)
              `,
            }}
          >
            {/* Form Glow Effect */}
            <div
              className="absolute -inset-4 bg-gradient-to-r from-amber-400/10 to-transparent to-90% rounded-3xl blur-xl opacity-50"
              style={{
                transform: `translateX(${mousePosition.x * 20}px) translateY(${
                  mousePosition.y * 20
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

              {/* Event Type - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-300 mb-3 ml-1">
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
                      className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        formData.eventType === event.value
                          ? "border-amber-400 bg-amber-400/20 text-amber-300 shadow-lg shadow-amber-500/25"
                          : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-amber-500/50"
                      }`}
                    >
                      <div className="text-2xl mb-1">{event.emoji}</div>
                      <div className="text-sm font-medium">{event.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Departments */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-amber-300 mb-3 ml-1">
                  Departments Needed
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      value: "IT",
                      icon: "💻",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      value: "Graphic Design",
                      icon: "🎨",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      value: "Design",
                      icon: "✏️",
                      color: "from-green-500 to-emerald-500",
                    },
                    {
                      value: "Marketing",
                      icon: "📈",
                      color: "from-orange-500 to-red-500",
                    },
                  ].map((dep) => (
                    <label
                      key={dep.value}
                      className={`department-checkbox cursor-pointer transform transition-all duration-300 hover:scale-105 ${
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
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          formData.departments.includes(dep.value)
                            ? `border-transparent bg-gradient-to-br ${dep.color} text-white shadow-lg`
                            : "border-gray-600 bg-gray-800/50 text-gray-400"
                        }`}
                      >
                        <div className="text-2xl mb-2">{dep.icon}</div>
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
                <label className="block text-sm font-medium text-amber-300 mb-3 ml-1">
                  Project Details
                </label>
                <div className="relative">
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    onFocus={() => setActiveField("details")}
                    onBlur={() => setActiveField(null)}
                    className="w-full h-32 px-4 py-3 bg-gray-800/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 resize-none backdrop-blur-sm"
                    placeholder="Tell us about your project or event..."
                    style={{
                      transform:
                        activeField === "details"
                          ? "translateZ(10px)"
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
            <div className="text-center pt-6 relative z-10">
              <HolographicButton
                type="submit"
                disabled={isSubmitting}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative px-8 py-4 text-black font-bold text-lg tracking-wider">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
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

// Improved Floating Label Input Component
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
          className="w-full px-4 py-4 bg-gray-800/50 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all duration-300 peer backdrop-blur-sm"
          placeholder={label}
          style={{
            transform: isActive ? "translateZ(10px)" : "translateZ(0)",
          }}
        />

        {/* Bottom border line */}
        <div
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300 ${
            isActive ? "opacity-100 scale-100" : "opacity-50 scale-95"
          }`}
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-300 pointer-events-none ${
            hasValue || isActive
              ? "top-1 text-amber-300 text-xs font-medium transform -translate-y-2 bg-gray-900 px-2 rounded-lg"
              : "top-4 text-gray-400 text-base"
          } ${isActive ? "text-amber-300" : ""}`}
        >
          {label}
          {required && <span className="text-amber-400 ml-1">*</span>}
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
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded-xl blur-sm opacity-75 group-hover:opacity-100 group-hover:blur-md transition-all duration-300 animate-gradient-xy" />
      <div className="relative bg-gradient-to-r from-amber-300 to-yellow-400 rounded-xl shadow-2xl group-hover:shadow-amber-500/25 transition-all duration-300">
        {children}
      </div>
    </button>
  );
};

export default StartProject;
