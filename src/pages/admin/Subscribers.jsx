import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function Subscribers() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const coll = collection(db, "subscribers");
    const q = query(coll, orderBy("subscribedAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({
          id: d.id,
          email: d.data().email,
          subscribedAt: d.data().subscribedAt,
          dateSubscribed: d.data().dateSubscribed,
        }));
        setSubscribers(rows);
        setError("");
      },
      (error) => {
        console.error("Failed loading subscribers:", error);
        setError("Failed to load subscribers: " + error.message);
        setSubscribers([]);
      }
    );

    return () => unsub();
  }, []);

  async function addSubscriber(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter a valid email address");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check for duplicate
    if (subscribers.some((s) => s.email === normalizedEmail)) {
      setError("This email is already subscribed");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "subscribers"), {
        email: normalizedEmail,
        subscribedAt: serverTimestamp(),
        dateSubscribed: serverTimestamp(),
      });
      setEmail("");
      setSuccess("Subscriber added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error adding subscriber:", error);
      setError("Failed to add subscriber: " + error.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  }

  async function removeSubscriber(id) {
    setDeleteLoading(id);
    try {
      await deleteDoc(doc(db, "subscribers", id));
      setSuccess("Subscriber removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error removing subscriber:", error);
      setError("Failed to remove subscriber: " + error.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeleteLoading(null);
    }
  }

  // Filter subscribers based on search
  const filteredSubscribers = useMemo(() => {
    if (!searchTerm.trim()) return subscribers;

    return subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subscribers, searchTerm]);

  const allEmails = useMemo(
    () => filteredSubscribers.map((s) => s.email).join(", "),
    [filteredSubscribers]
  );

  const copyToClipboard = async (text, type = "all") => {
    if (!text) {
      setError("No emails to copy");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setSuccess(`Copied ${type === "all" ? "all" : ""} emails to clipboard!`);
      setTimeout(() => {
        setCopied("");
        setSuccess("");
      }, 2000);
    } catch (error) {
      setError("Failed to copy to clipboard");
      setTimeout(() => setError(""), 3000);
    }
  };

  const copyAll = () => copyToClipboard(allEmails, "all");

  const copyEmail = (email) => copyToClipboard(email, "single");

  const clearSearch = () => setSearchTerm("");

  const totalSubscribers = subscribers.length;
  const filteredCount = filteredSubscribers.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📧 Subscribers Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage your email subscribers ({totalSubscribers} total)
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Add Subscriber Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Subscriber
          </h2>
          <form
            onSubmit={addSubscriber}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
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
                    Adding...
                  </span>
                ) : (
                  "Add Subscriber"
                )}
              </button>
              <button
                type="button"
                onClick={copyAll}
                disabled={filteredCount === 0}
                className="border border-gray-300 text-gray-700 rounded-lg px-6 py-3 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied === "all" ? "✓ Copied!" : `Copy All (${filteredCount})`}
              </button>
            </div>
          </form>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 w-full">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Subscribers
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredCount} of {totalSubscribers} subscribers
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No subscribers
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try changing your search terms"
                  : "Get started by adding your first subscriber"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {subscriber.email}
                          </span>
                          <button
                            onClick={() => copyEmail(subscriber.email)}
                            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy email"
                          >
                            {copied === `single-${subscriber.id}` ? "✓" : "📋"}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.subscribedAt
                          ?.toDate?.()
                          ?.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }) ||
                          subscriber.dateSubscribed
                            ?.toDate?.()
                            ?.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }) ||
                          "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setDeleteConfirm(subscriber.id)}
                          disabled={deleteLoading === subscriber.id}
                          className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === subscriber.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Removal
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to remove this subscriber? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => removeSubscriber(deleteConfirm)}
                  disabled={deleteLoading === deleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteLoading === deleteConfirm
                    ? "Removing..."
                    : "Remove Subscriber"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
