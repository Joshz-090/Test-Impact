import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { uploadImage } from "../../utils/uploadImage";
import MemberManager from "../../components/admin/MemberManager";

import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaTelegram,
  FaFacebook,
  FaGlobe,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

export default function AdminAddMember() {
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    description: "",
    department: "",
    isLeader: false,
    contacts: {
      email: "",
      phone: "",
      telegram: "",
      instagram: "",
      linkedin: "",
      facebook: "",
      twitter: "",
      website: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [descriptionError, setDescriptionError] = useState("");
  const [showManager, setShowManager] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // Fetch departments from Firestore
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsSnapshot = await getDocs(
          collection(db, "departments")
        );
        const departmentsData = departmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setMessage({
          type: "error",
          text: "Error loading departments. Please try again.",
        });
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle description validation
    if (name === "description") {
      const length = value.length;
      if (length < 70) {
        setDescriptionError(
          `Description must be at least 70 characters (${length}/70)`
        );
      } else if (length > 120) {
        setDescriptionError(
          `Description must be no more than 120 characters (${length}/120)`
        );
      } else {
        setDescriptionError("");
      }
    }

    if (name.startsWith("contact_")) {
      const contactType = name.replace("contact_", "");
      setFormData((prev) => ({
        ...prev,
        contacts: {
          ...prev.contacts,
          [contactType]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: "error",
          text: "Please select a valid image file (.jpg, .png, .jpeg)",
        });
        return;
      }

      // Validate file size (optional - 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }

      setSelectedPhoto(file);
      setMessage({ type: "", text: "" });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    setDescriptionError("");

    // Validate description length
    if (formData.description.length < 70 || formData.description.length > 120) {
      setMessage({
        type: "error",
        text: "Description must be between 70-120 characters.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let photoURL = "";

      // Upload photo if selected
      if (selectedPhoto) {
        try {
          photoURL = await uploadImage(selectedPhoto);
        } catch (uploadError) {
          console.error("Error uploading photo:", uploadError);
          setMessage({
            type: "error",
            text: "Error uploading photo. Please try again.",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare member data for Firestore
      const memberData = {
        name: formData.name,
        role: formData.jobTitle, // Using jobTitle as role for consistency
        department: formData.department,
        description: formData.description,
        isLeader: formData.isLeader,
        contacts: formData.contacts,
        photoURL: photoURL,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore
      await addDoc(collection(db, "members"), memberData);

      // Reset form after successful submission
      setFormData({
        name: "",
        jobTitle: "",
        description: "",
        department: "",
        isLeader: false,
        contacts: {
          email: "",
          phone: "",
          telegram: "",
          instagram: "",
          linkedin: "",
          facebook: "",
          twitter: "",
          website: "",
        },
      });

      // Reset photo states
      setSelectedPhoto(null);
      setPhotoPreview(null);
      // Reset file input
      const fileInput = document.getElementById("photo");
      if (fileInput) fileInput.value = "";

      setMessage({
        type: "success",
        text: "Member added successfully!",
      });
    } catch (error) {
      console.error("Error adding member:", error);
      setMessage({
        type: "error",
        text: "Error adding member. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Team Member Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Add and manage company team members with their roles and contact
              information
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              👥 Members
            </span>
          </div>
        </div>
      </div>

      {/* Add Member Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Team Member
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Fill in the member details and contact information
          </p>
        </div>
        <div className="p-6">
          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {message.type === "success" ? "✅" : "❌"}
                </span>
                {message.text}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter member's full name"
                />
              </div>

              <div>
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Title *
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Senior Developer, Marketing Manager"
                />
              </div>
            </div>

            {/* Department and Leadership */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={loadingDepartments}
                >
                  <option value="">
                    {loadingDepartments
                      ? "Loading departments..."
                      : "Select Department"}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name} ({dept.numberOfMembers} members)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <div className="flex items-center h-5">
                  <input
                    id="isLeader"
                    name="isLeader"
                    type="checkbox"
                    checked={formData.isLeader}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="isLeader"
                    className="font-medium text-gray-700"
                  >
                    Department Leader
                  </label>
                  <p className="text-gray-500">
                    Check if this member leads the department
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                📸 Member Photo
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept=".jpg,.jpeg,.png"
                  onChange={handlePhotoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-sm text-gray-500">
                  Upload a photo of the team member. Accepted formats: .jpg,
                  .png, .jpeg (max 5MB)
                </p>

                {/* Photo Preview */}
                {photoPreview && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={photoPreview}
                        alt="Photo preview"
                        className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Photo Preview
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedPhoto?.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(null);
                        setPhotoPreview(null);
                        const fileInput = document.getElementById("photo");
                        if (fileInput) fileInput.value = "";
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                About Member * (70-120 characters)
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    descriptionError
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : formData.description.length >= 70 &&
                        formData.description.length <= 120
                      ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Brief description about the member, their background, expertise, and role in the company..."
                />
                <div className="absolute top-2 right-2 flex items-center space-x-1">
                  {formData.description.length >= 70 &&
                  formData.description.length <= 120 ? (
                    <FaCheckCircle className="text-green-500 text-sm" />
                  ) : formData.description.length > 0 ? (
                    <FaExclamationTriangle className="text-red-500 text-sm" />
                  ) : null}
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="text-sm">
                  {descriptionError ? (
                    <span className="text-red-600">{descriptionError}</span>
                  ) : formData.description.length >= 70 &&
                    formData.description.length <= 120 ? (
                    <span className="text-green-600">
                      ✓ Description length is perfect!
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      {formData.description.length}/70-120 characters
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {formData.description.length} characters
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email - Required */}
                <div>
                  <label
                    htmlFor="contact_email"
                    className="flex items-center text-sm font-medium text-gray-700 mb-2"
                  >
                    <FaEnvelope className="mr-2 text-blue-500" />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={formData.contacts.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="member@company.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="contact_phone"
                    className="flex items-center text-sm font-medium text-gray-700 mb-2"
                  >
                    <FaPhone className="mr-2 text-green-500" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contacts.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label
                    htmlFor="contact_linkedin"
                    className="flex items-center text-sm font-medium text-gray-700 mb-2"
                  >
                    <FaLinkedin className="mr-2 text-blue-600" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="contact_linkedin"
                    name="contact_linkedin"
                    value={formData.contacts.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* Telegram */}
                <div>
                  <label
                    htmlFor="contact_telegram"
                    className="flex items-center text-sm font-medium text-gray-700 mb-2"
                  >
                    <FaTelegram className="mr-2 text-blue-400" />
                    Telegram
                  </label>
                  <input
                    type="text"
                    id="contact_telegram"
                    name="contact_telegram"
                    value={formData.contacts.telegram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="@username or t.me/username"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label
                    htmlFor="contact_instagram"
                    className="flex items-center text-sm font-medium text-gray-700 mb-2"
                  >
                    <FaInstagram className="mr-2 text-pink-500" />
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="contact_instagram"
                    name="contact_instagram"
                    value={formData.contacts.instagram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="@username or instagram.com/username"
                  />
                </div>

                {/* Facebook */}
                <div>
                  <label
                    htmlFor="contact_facebook"
                    className="flex items-center text-sm font-medium text-gray-700 mb-2"
                  >
                    <FaFacebook className="mr-2 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="contact_facebook"
                    name="contact_facebook"
                    value={formData.contacts.facebook}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://facebook.com/username"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label
                    htmlFor="contact_twitter"
                    className="flex items-center text-sm font-medium text-gray-700 mb-2"
                  >
                    <FaTwitter className="mr-2 text-blue-400" />
                    Twitter/X
                  </label>
                  <input
                    type="text"
                    id="contact_twitter"
                    name="contact_twitter"
                    value={formData.contacts.twitter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="@username or x.com/username"
                  />
                </div>

                {/* Website */}
                <div>
                  <label
                    htmlFor="contact_website"
                    className="flex items-center text-sm font-medium text-gray-700 mb-2"
                  >
                    <FaGlobe className="mr-2 text-gray-600" />
                    Website
                  </label>
                  <input
                    type="url"
                    id="contact_website"
                    name="contact_website"
                    value={formData.contacts.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://personal-website.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    {selectedPhoto
                      ? "Uploading photo and adding member..."
                      : "Adding Member..."}
                  </>
                ) : (
                  <>
                    <span className="mr-2">👥</span>
                    Add Team Member
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowManager((v) => !v)}
          className="inline-flex items-center px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
        >
          {showManager ? "Hide Members" : "Show All Members"}
        </button>
      </div>

      {showManager && <MemberManager onClose={() => setShowManager(false)} />}

      {/* Team Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Team Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👑</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">
                  Department Leaders
                </p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">
                  Departments
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {departments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-900">
                  Avg per Dept
                </p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members List Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Team Members
        </h3>
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-4 block">👥</span>
          <p className="text-lg font-medium">No team members added yet</p>
          <p className="text-sm">
            Use the form above to add your first team member
          </p>
        </div>
      </div>
    </div>
  );
}
