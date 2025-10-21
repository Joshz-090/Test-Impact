// Debug component to test Cloudinary configuration
import React from "react";

const CloudinaryDebug = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">
        Cloudinary Configuration Debug
      </h3>
      <div className="space-y-1 text-sm">
        <div>
          <strong>Cloud Name:</strong> {cloudName ? "✅ Set" : "❌ Missing"}
        </div>
        <div>
          <strong>Upload Preset:</strong>{" "}
          {uploadPreset ? "✅ Set" : "❌ Missing"}
        </div>
        <div>
          <strong>API Key:</strong> {apiKey ? "✅ Set" : "❌ Missing"}
        </div>
        <div>
          <strong>API Secret:</strong> {apiSecret ? "✅ Set" : "❌ Missing"}
        </div>
      </div>
      {(!cloudName || !uploadPreset) && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700">
          <strong>Missing Required Variables:</strong>
          <ul className="list-disc list-inside mt-1">
            {!cloudName && <li>VITE_CLOUDINARY_CLOUD_NAME</li>}
            {!uploadPreset && <li>VITE_CLOUDINARY_UPLOAD_PRESET</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CloudinaryDebug;
