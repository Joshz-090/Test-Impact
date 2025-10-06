import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminContacts() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "contactSubmissions"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSubmissions(rows);
    } catch (e) {
      setError("Failed to load submissions");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "contactSubmissions", id), { status: "read" });
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "read" } : s))
      );
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this submission? This cannot be undone."
    );
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, "contactSubmissions", id));
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error("Failed to delete submission", e);
      setError("Failed to delete submission");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 border-b">
        <h1 className="text-xl md:text-2xl font-semibold">
          Contact Submissions
        </h1>
        <p className="text-gray-500">Messages sent via the Contact page</p>
      </div>
      <div className="p-4 md:p-6">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : submissions.length === 0 ? (
          <div className="text-gray-500">No submissions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600">
                      <a href={`mailto:${s.email}`}>{s.email}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xl">
                      {expanded[s.id]
                        ? s.message
                        : s.message?.length > 160
                        ? `${s.message.slice(0, 160)}…`
                        : s.message}
                      {s.message?.length > 160 && (
                        <button
                          onClick={() => toggleExpand(s.id)}
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          {expanded[s.id] ? "Show less" : "Show more"}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          s.status === "new"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {s.status || "new"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center gap-2 justify-end">
                        {s.status !== "read" && (
                          <button
                            onClick={() => markAsRead(s.id)}
                            className="px-3 py-1 rounded-md bg-gold-500 hover:bg-gold-600 text-black font-medium"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
