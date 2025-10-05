// utils/uploadImage.js
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Impact_production"); // your preset

  const cloudName = "ddsgyjpva"; // replace with your real cloud name
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url; // this is the URL to save in Firebase
}
