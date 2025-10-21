import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const StartProject = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    departments: [],
    details: "",
  });

  // Fetch departments from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "departments"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDepartments(data);
        setIsLoadingDepartments(false);
      },
      (error) => {
        console.error("Error loading departments:", error);
        setIsLoadingDepartments(false);
      }
    );
    return () => unsubscribe();
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
      formRef.current.classList.add("submit-success");
      setTimeout(() => navigate("/thank-you"), 2000);
    } catch (error) {
      console.error("Error saving project:", error);
      formRef.current.classList.add("submit-error");
      setTimeout(() => formRef.current.classList.remove("submit-error"), 3000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 bg-gray-100">
      <div
        className="max-w-2xl w-full space-y-8 p-8 bg-white rounded-2xl shadow-2xl border border-yellow-200"
        ref={formRef}
      >
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
            Start Your Project
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-lg mx-auto">
            Collaborate with our expert teams in{" "}
            <span className="text-yellow-600 font-semibold">
              IT, Graphic Design, Design, and Marketing
            </span>{" "}
            to bring your vision to life.
          </p>
          <div className="mt-3 text-gray-800 font-medium text-lg">
            Contact us at <b>+251 953454460</b>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name field */}
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
            {/* Email field */}
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
            {/* Phone field */}
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
            {/* Event Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-yellow-700 mb-2 ml-1">
                Event Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["corporate", "wedding", "conference", "other"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, eventType: type }))
                    }
                    className={`p-4 rounded-lg border-2 transition duration-150 ${
                      formData.eventType === type
                        ? "border-yellow-500 bg-yellow-100 text-gray-900"
                        : "border-gray-300 bg-gray-100 text-gray-700"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {/* Departments */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-yellow-700 mb-2 ml-1">
                Departments Needed
              </label>
              {isLoadingDepartments ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : departments.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {departments.map((dept) => (
                    <label
                      key={dept.id}
                      className="cursor-pointer flex items-center"
                    >
                      <input
                        type="checkbox"
                        name="departments"
                        value={dept.name}
                        checked={formData.departments.includes(dept.name)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm">{dept.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  No departments available. Please contact admin.
                </div>
              )}
            </div>
            {/* Details */}
            <div className="md:col-span-2 relative">
              <label className="block text-sm font-medium text-yellow-700 mb-2 ml-1">
                Project Details
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                onFocus={() => setActiveField("details")}
                onBlur={() => setActiveField(null)}
                className="w-full h-28 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition duration-150 resize-none"
                placeholder="Tell us about your project or event..."
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
                {formData.details.length}/500
              </div>
            </div>
          </div>
          <div className="pt-4 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-yellow-500 text-white font-semibold text-lg rounded-lg shadow transition duration-150 hover:bg-yellow-600"
            >
              {isSubmitting ? "Submitting..." : "Launch Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  React.useEffect(() => setHasValue(value.length > 0), [value]);
  return (
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
        className="w-full px-4 py-3 bg-white rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition duration-150 border border-gray-300"
        placeholder={label}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 top-3 text-gray-600 transition-all duration-150 pointer-events-none ${
          hasValue || isActive
            ? "-translate-y-6 text-sm text-yellow-700 bg-white px-1 rounded"
            : ""
        }`}
      >
        {label} {required && <span className="text-yellow-600">*</span>}
      </label>
    </div>
  );
};

export default StartProject;
