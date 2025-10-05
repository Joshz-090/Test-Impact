import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContextBase";
import { addEvent, updateEvent } from "../../utils/eventUtils";
import { uploadImage } from "../../utils/uploadImage";
import toast from "react-hot-toast";

export default function EventPromotionForm({
  eventToEdit = null,
  onEventSaved = null,
}) {
  const { role } = useAuth();
  const [formData, setFormData] = useState({
    title: eventToEdit?.title || "",
    shortDescription: eventToEdit?.shortDescription || "",
    fullDescription: eventToEdit?.fullDescription || [""],
    category: eventToEdit?.category || "event",
    eventDate: eventToEdit?.eventDate || "",
    eventTime: eventToEdit?.eventTime || "",
    videoLink: eventToEdit?.videoLink || "",
    images: eventToEdit?.images || [],
    location: eventToEdit?.location || "",
    organizerName: eventToEdit?.organizerName || "",
    contactLink: eventToEdit?.contactLink || "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize form with existing event data
  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || "",
        shortDescription: eventToEdit.shortDescription || "",
        fullDescription: eventToEdit.fullDescription || [""],
        category: eventToEdit.category || "event",
        eventDate: eventToEdit.eventDate || "",
        eventTime: eventToEdit.eventTime || "",
        videoLink: eventToEdit.videoLink || "",
        images: eventToEdit.images || [],
        location: eventToEdit.location || "",
        organizerName: eventToEdit.organizerName || "",
        contactLink: eventToEdit.contactLink || "",
      });
      setImageUrls(eventToEdit.images || []);
    }
  }, [eventToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...formData.fullDescription];
    newDescriptions[index] = value;
    setFormData((prev) => ({ ...prev, fullDescription: newDescriptions }));
  };

  const addDescriptionParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      fullDescription: [...prev.fullDescription, ""],
    }));
  };

  const removeDescriptionParagraph = (index) => {
    if (formData.fullDescription.length > 1) {
      const newDescriptions = formData.fullDescription.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, fullDescription: newDescriptions }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleImageUrlAdd = () => {
    const url = prompt("Enter image URL:");
    if (url && url.trim()) {
      setImageUrls((prev) => [...prev, url.trim()]);
    }
  };

  const removeImage = (index, type) => {
    if (type === "file") {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.shortDescription || !formData.eventDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Prepare images array
      const allImages = [...imageUrls];

      // Upload file images to Cloudinary
      for (const file of imageFiles) {
        try {
          const imageUrl = await uploadImage(file);
          allImages.push(imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error(`Failed to upload image: ${file.name}`);
        }
      }

      const eventData = {
        ...formData,
        images: allImages,
        fullDescription: formData.fullDescription.filter(
          (desc) => desc.trim() !== ""
        ),
      };

      let result;
      if (eventToEdit) {
        result = await updateEvent(eventToEdit.id, eventData);
      } else {
        result = await addEvent(eventData);
      }

      if (result.success) {
        toast.success(
          eventToEdit
            ? "Event updated successfully!"
            : "Event added successfully!"
        );

        // Reset form
        setFormData({
          title: "",
          shortDescription: "",
          fullDescription: [""],
          category: "event",
          eventDate: "",
          eventTime: "",
          videoLink: "",
          images: [],
          location: "",
          organizerName: "",
          contactLink: "",
        });
        setImageFiles([]);
        setImageUrls([]);

        if (onEventSaved) {
          onEventSaved();
        }
      } else {
        toast.error(result.error || "Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("An error occurred while saving the event");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      shortDescription: "",
      fullDescription: [""],
      category: "event",
      eventDate: "",
      eventTime: "",
      videoLink: "",
      images: [],
      location: "",
      organizerName: "",
      contactLink: "",
    });
    setImageFiles([]);
    setImageUrls([]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {eventToEdit ? "Edit Event" : "Add New Event"}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Access Level:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              role === "super"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {role === "super" ? "Super Admin" : "Normal Admin"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="event">Event</option>
              <option value="exhibition">Exhibition</option>
              <option value="workshop">Workshop</option>
              <option value="conference">Conference</option>
              <option value="festival">Festival</option>
              <option value="symposium">Symposium</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description *
          </label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the event"
            required
          />
        </div>

        {/* Full Description Paragraphs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Description Paragraphs *
          </label>
          {formData.fullDescription.map((paragraph, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Paragraph {index + 1}
                </span>
                {formData.fullDescription.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDescriptionParagraph(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                value={paragraph}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter paragraph content..."
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addDescriptionParagraph}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Add Another Paragraph
          </button>
        </div>

        {/* Event Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date *
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Time
            </label>
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Video Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube or TikTok Video Link
          </label>
          <input
            type="url"
            name="videoLink"
            value={formData.videoLink}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://youtube.com/watch?v=... or https://tiktok.com/@user/video/..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Supports YouTube and TikTok links. Videos will be embedded
            automatically.
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Event Images
          </h3>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <svg
                  className="mx-auto h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-600 mt-2">
                  Click to upload images or drag and drop
                </p>
              </label>
            </div>
          </div>

          {/* Add Image URL */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleImageUrlAdd}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Image URL
            </button>
          </div>

          {/* Image Previews */}
          {(imageFiles.length > 0 || imageUrls.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageFiles.map((file, index) => (
                <div key={`file-${index}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, "file")}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              {imageUrls.map((url, index) => (
                <div key={`url-${index}`} className="relative">
                  <img
                    src={url}
                    alt={`URL ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/100x100?text=Invalid+URL";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, "url")}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location and Organizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Venue *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event location"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organizer Name *
            </label>
            <input
              type="text"
              name="organizerName"
              value={formData.organizerName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter organizer name"
              required
            />
          </div>
        </div>

        {/* Contact Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Link (Optional)
          </label>
          <input
            type="url"
            name="contactLink"
            value={formData.contactLink}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://t.me/username or https://instagram.com/username or email@example.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            Telegram, Instagram, Email, or any contact link
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear Form
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                {eventToEdit ? "Updating Event..." : "Adding Event..."}
              </>
            ) : eventToEdit ? (
              "Update Event"
            ) : (
              "Add Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
