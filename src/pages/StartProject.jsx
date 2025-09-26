import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; // make sure this file is set up
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const StartProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    departments: [],
    details: "",
  });

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

    try {
      await addDoc(collection(db, "projects"), {
        ...formData,
        createdAt: serverTimestamp(), // add server timestamp
      });

      console.log("Project submitted:", formData);
      navigate("/thank-you"); // Redirect after successful submission
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black sm:text-5xl">
            Start Your Project
          </h1>
          <p className="mt-4 text-lg text-black sm:text-xl">
            Let’s bring your event or project to life! Collaborate with our
            expert teams in IT, Graphic Design, Design, and Marketing.
            <br />
            <span className="font-semibold text-[#d4af37]">
              Contact us at: +251953454460
            </span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black"
            >
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-black rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-black placeholder-gray-400"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-black rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-black placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-black"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-black rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-black placeholder-gray-400"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Event Type */}
          <div>
            <label
              htmlFor="eventType"
              className="block text-sm font-medium text-black"
            >
              Event Type
            </label>
            <select
              name="eventType"
              id="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-black rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-black"
              required
            >
              <option value="">Select an event type</option>
              <option value="corporate">Corporate Event</option>
              <option value="wedding">Wedding</option>
              <option value="conference">Conference</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Departments */}
          <div>
            <label className="block text-sm font-medium text-black">
              Departments Needed
            </label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["IT", "Graphic Design", "Design", "Marketing"].map((dep) => (
                <label key={dep} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="departments"
                    value={dep}
                    checked={formData.departments.includes(dep)}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#d4af37] border-black focus:ring-[#d4af37]"
                  />
                  <span className="ml-2 text-black">{dep}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-black"
            >
              Project Details
            </label>
            <textarea
              name="details"
              id="details"
              value={formData.details}
              onChange={handleChange}
              className="mt-1 p-3 w-full border border-black rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-black placeholder-gray-400"
              rows="5"
              placeholder="Tell us about your project or event..."
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn-53 inline-flex items-center px-6 py-3 bg-[#d4af37] text-black font-semibold rounded-md hover:bg-black hover:text-white transition-colors duration-300"
            >
              <div className="original">Submit Project</div>
              <div className="letters">
                {[
                  "S",
                  "u",
                  "b",
                  "m",
                  "i",
                  "t",
                  " ",
                  "P",
                  "r",
                  "o",
                  "j",
                  "e",
                  "c",
                  "t",
                ].map((letter, index) => (
                  <span key={index} className={letter === " " ? "space" : ""}>
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartProject;
