// utils/uploadImage.js
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUD_NAME;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing Cloudinary environment variables (VITE_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET)."
    );
  }

  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }
  return data.secure_url; // URL to save in Firebase
}
