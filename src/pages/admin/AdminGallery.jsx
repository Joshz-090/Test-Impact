import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import CloudinaryDebug from "../../components/CloudinaryDebug";
import toast from "react-hot-toast";

const AdminGallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageFile: null,
    imagePreview: null,
  });

  // Fetch gallery images
  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGalleryImages(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading gallery images:", error);
        setIsLoading(false);
        toast.error("Failed to load gallery images");
      }
    );

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile" && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageFile) {
      toast.error("Please select an image");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    // Check if Cloudinary environment variables are set
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error(
        "Cloudinary configuration missing. Please check environment variables."
      );
      console.error("Missing Cloudinary environment variables:", {
        cloudName: !!cloudName,
        uploadPreset: !!uploadPreset,
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log("Starting image upload...");

      // Upload image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(formData.imageFile);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      console.log("Image uploaded successfully:", uploadResult.imageUrl);

      // Save to Firestore
      const docRef = await addDoc(collection(db, "gallery"), {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        imageUrl: uploadResult.imageUrl,
        publicId: uploadResult.publicId,
        createdAt: new Date(),
      });

      console.log("Document written with ID:", docRef.id);

      toast.success("Image added to gallery successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        imageFile: null,
        imagePreview: null,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding image:", error);
      toast.error(`Failed to add image to gallery: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "gallery", imageId));
      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      imageFile: null,
      imagePreview: null,
    });
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
        >
          Add New Image
        </button>
      </div>

      {/* Debug Component - Remove this after setup is complete */}
      <div className="mb-6">
        <CloudinaryDebug />
      </div>

      {/* Add Image Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Image
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image *
                  </label>
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                  {formData.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Enter image title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Enter image description"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    <option value="">Select Category</option>
                    <option value="Events">Events</option>
                    <option value="Artwork">Artwork</option>
                    <option value="Team">Team</option>
                    <option value="Projects">Projects</option>
                    <option value="Community">Community</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#B8941F] transition-colors disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Add Image"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-12">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {image.title}
              </h3>
              {image.description && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {image.description}
                </p>
              )}
              {image.category && (
                <span className="inline-block bg-[#D4AF37] text-black px-2 py-1 rounded-full text-xs font-semibold mb-3">
                  {image.category}
                </span>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {image.createdAt &&
                    new Date(image.createdAt.toDate()).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {galleryImages.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Images Yet
          </h3>
          <p className="text-gray-500">
            Start building your gallery by adding some images.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
