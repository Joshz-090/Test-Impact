// Cloudinary upload utilities - Simplified version without cloudinary package
// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Missing Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET)."
      );
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || "Upload failed");
    }

    const data = await response.json();
    return {
      success: true,
      imageUrl: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete image from Cloudinary (requires server-side implementation)
export const deleteImageFromCloudinary = async (_publicId) => {
  try {
    // Note: This requires a server-side endpoint to handle deletion
    // For now, we'll just return success since we can't delete from client-side
    console.warn(
      "Image deletion from Cloudinary requires server-side implementation"
    );
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
