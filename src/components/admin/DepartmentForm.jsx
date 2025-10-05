import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContextBase";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { uploadImage } from "../../utils/uploadImage";

export default function DepartmentForm({
  editingDepartment,
  onSuccess,
  onCancel,
}) {
  const { role } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manager: "",
    numberOfMembers: 1,
    icon: "",
    specialties: [],
    image: "",
    telegramLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [specialtiesInput, setSpecialtiesInput] = useState("");
  const [imageInputType, setImageInputType] = useState("file"); // 'file' or 'url'

  // Populate form when editing
  useEffect(() => {
    if (editingDepartment) {
      setFormData({
        name: editingDepartment.name || "",
        description: editingDepartment.description || "",
        manager: editingDepartment.manager || "",
        numberOfMembers: editingDepartment.numberOfMembers || 1,
        icon: editingDepartment.icon || "",
        specialties: editingDepartment.specialties || [],
        image: editingDepartment.image || "",
        telegramLink: editingDepartment.telegramLink || "",
      });
      if (editingDepartment.image) {
        setImagePreview(editingDepartment.image);
        // Determine if existing image is a URL or uploaded file
        setImageInputType(
          editingDepartment.image.startsWith("http") ? "url" : "file"
        );
      }
    }
  }, [editingDepartment]);

  // Auto-dismiss messages
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (name === "image") {
        setSelectedImage(file);
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image: url }));
    
    // Update preview if it's a valid URL
    if (url && isValidUrl(url)) {
      setImagePreview(url);
    } else if (!url) {
      setImagePreview(null);
    }
  };

  const handleImageTypeChange = (type) => {
    setImageInputType(type);
    // Clear previous image data when switching types
    if (type === "url") {
      setSelectedImage(null);
      const fileInput = document.getElementById("image-file");
      if (fileInput) fileInput.value = "";
    } else {
      setFormData((prev) => ({ ...prev, image: "" }));
    }
    setImagePreview(null);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const addSpecialty = () => {
    if (specialtiesInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialtiesInput.trim()],
      }));
      setSpecialtiesInput("");
    }
  };

  const removeSpecialty = (index) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.manager) {
        showMessage(
          "Please fill in all required fields (name, description, manager)",
          "error"
        );
        setLoading(false);
        return;
      }

      let imageURL = formData.image; // Start with URL if provided

      // Upload image if file is selected
      if (imageInputType === "file" && selectedImage) {
        try {
          imageURL = await uploadImage(selectedImage);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showMessage("Error uploading image. Please try again.", "error");
          setLoading(false);
          return;
        }
      }

      // Validate URL if using URL input
      if (imageInputType === "url" && formData.image && !isValidUrl(formData.image)) {
        showMessage("Please enter a valid image URL", "error");
        setLoading(false);
        return;
      }

      // Prepare department data for Firestore
      const departmentData = {
        name: formData.name,
        description: formData.description,
        manager: formData.manager,
        numberOfMembers: formData.numberOfMembers,
        icon: formData.icon,
        specialties: formData.specialties,
        image: imageURL,
        telegramLink: formData.telegramLink,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore
      if (editingDepartment) {
        // Update existing department
        const departmentRef = doc(db, "departments", editingDepartment.id);
        await updateDoc(departmentRef, departmentData);
        showMessage("Department updated successfully!", "success");
      } else {
        // Create new department
        await addDoc(collection(db, "departments"), departmentData);
        showMessage("Department created successfully!", "success");
      }

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Reset form after successful submission (only for new departments)
      if (!editingDepartment) {
        setFormData({
          name: "",
          description: "",
          manager: "",
          numberOfMembers: 1,
          icon: "",
          specialties: [],
          image: "",
          telegramLink: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
        setSpecialtiesInput("");
        setImageInputType("file");

        // Reset file input
        const fileInput = document.getElementById("image-file");
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      console.error("Error creating department:", error);
      showMessage("Error creating department. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      manager: "",
      numberOfMembers: 1,
      icon: "",
      specialties: [],
      image: "",
      telegramLink: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setSpecialtiesInput("");
    setImageInputType("file");

    // Reset file inputs
    const fileInput = document.getElementById("image-file");
    if (fileInput) fileInput.value = "";
  };

  // Only show for Super Admins
  if (role !== "super") {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600">
            Only Super Admins can create and manage departments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">
          {editingDepartment ? "Edit Department" : "Create Department"}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Access Level:</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Super Admin
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            messageType === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            {messageType === "success" ? (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            )}
          </svg>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Department Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-black border-b border-gray-200 pb-2">
            Department Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Department Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                placeholder="e.g., Marketing, Development, Design"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Manager Name *
              </label>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                placeholder="e.g., John Doe"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Number of Members *
              </label>
              <input
                type="number"
                name="numberOfMembers"
                value={formData.numberOfMembers}
                onChange={handleInputChange}
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                placeholder="e.g., 5"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
              placeholder="Comprehensive description of the department's responsibilities, goals, and structure..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                placeholder="e.g., 🎨, 💻, 🏗️"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Telegram Link
              </label>
              <input
                type="url"
                name="telegramLink"
                value={formData.telegramLink}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                placeholder="https://t.me/department_chat"
              />
            </div>
          </div>

          {/* Specialties Section */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Specialties
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                placeholder="Enter a specialty"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSpecialty())
                }
              />
              <button
                type="button"
                onClick={addSpecialty}
                className="px-4 py-2 bg-[#d4af37] text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2"
              >
                Add
              </button>
            </div>
            {formData.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload/Link Section */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Department Image
            </label>
            
            {/* Image Input Type Selector */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="imageType"
                  value="file"
                  checked={imageInputType === "file"}
                  onChange={() => handleImageTypeChange("file")}
                  className="mr-2"
                />
                Upload File
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="imageType"
                  value="url"
                  checked={imageInputType === "url"}
                  onChange={() => handleImageTypeChange("url")}
                  className="mr-2"
                />
                Use URL
              </label>
            </div>

            {/* File Upload Input */}
            {imageInputType === "file" && (
              <div>
                <input
                  type="file"
                  id="image-file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image for the department (optional)
                </p>
              </div>
            )}

            {/* URL Input */}
            {imageInputType === "url" && (
              <div>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a direct image URL (optional)
                </p>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-black mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Department preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            >
              Cancel
            </button>
          )}

          {!editingDepartment && (
            <button
              type="button"
              onClick={clearForm}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            >
              Clear Form
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {editingDepartment
                  ? "Updating Department..."
                  : "Creating Department..."}
              </>
            ) : editingDepartment ? (
              "Update Department"
            ) : (
              "Add Department"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}