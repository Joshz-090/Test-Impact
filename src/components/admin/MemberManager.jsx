import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { uploadImage } from "../../utils/uploadImage";

export default function MemberManager({ onClose }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "members"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMembers(list);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  const handleStartEdit = (member) => {
    setSelected({ ...member });
    setNewPhoto(null);
    setPhotoPreview(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    setNewPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("contacts.")) {
      const key = name.split(".")[1];
      setSelected((prev) => ({
        ...prev,
        contacts: { ...prev.contacts, [key]: value },
      }));
    } else {
      setSelected((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      let photoURL = selected.photoURL || "";
      if (newPhoto) {
        photoURL = await uploadImage(newPhoto);
      }
      const ref = doc(db, "members", selected.id);
      const update = {
        name: selected.name || "",
        role: selected.role || "",
        department: selected.department || "",
        description: selected.description || "",
        isLeader: !!selected.isLeader,
        contacts: selected.contacts || {},
        photoURL,
      };
      await updateDoc(ref, update);
      setSelected(null);
      setNewPhoto(null);
      setPhotoPreview(null);
    } catch (e) {
      // you can add toast here
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm("Are you sure you want to delete this member?")) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "members", selected.id));
      setSelected(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Members</h3>
        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          Close
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : !selected ? (
        <ul className="divide-y divide-gray-200">
          {members.length === 0 && (
            <li className="py-3 text-gray-500">No members found.</li>
          )}
          {members.map((m) => (
            <li key={m.id} className="py-3">
              <button
                onClick={() => handleStartEdit(m)}
                className="text-left w-full flex items-center justify-between hover:bg-gray-50 rounded-md px-2 py-1"
              >
                <span className="font-medium text-gray-800">{m.name}</span>
                <span className="text-xs text-gray-500">
                  {m.department || ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={photoPreview || selected.photoURL || ""}
              alt={selected.name}
              className="h-16 w-16 rounded-full object-cover border"
            />
            <div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handlePhotoChange}
              />
              {photoPreview && (
                <p className="text-xs text-gray-500 mt-1">New photo selected</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="name"
                value={selected.name || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="role"
                value={selected.role || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="department"
                value={selected.department || ""}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                id="isLeaderEdit"
                type="checkbox"
                name="isLeader"
                checked={!!selected.isLeader}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isLeaderEdit"
                className="ml-2 text-sm text-gray-700"
              >
                Department Leader
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              name="description"
              rows={3}
              value={selected.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="contacts.email"
                value={selected.contacts?.email || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="contacts.phone"
                value={selected.contacts?.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="contacts.linkedin"
                value={selected.contacts?.linkedin || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="contacts.instagram"
                value={selected.contacts?.instagram || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telegram
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="contacts.telegram"
                value={selected.contacts?.telegram || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="contacts.facebook"
                value={selected.contacts?.facebook || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter/X
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="contacts.twitter"
                value={selected.contacts?.twitter || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                name="contacts.website"
                value={selected.contacts?.website || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-x-2">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSaving || isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Member"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
