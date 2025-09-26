import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import ProtectedRoute from "../../components/admin/ProtectedRoute";
import { createAdminUser, changeAdminPassword } from "../../utils/adminUtils";
import { useAuth } from "../../context/AuthContextBase";

export default function Admins() {
  return (
    <ProtectedRoute>
      <AdminsInner />
    </ProtectedRoute>
  );
}

function AdminsInner() {
  const { role: currentRole, user: currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Auto dismiss feedback
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const coll = collection(db, "admins");
    const q = query(coll, orderBy("email", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAdmins(rows);
      },
      (error) => {
        console.error("Error fetching admins:", error);
        setError("Failed to load admin list");
      }
    );
    return () => unsub();
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRole("normal");
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setError("");
  };

  const showError = (message) => {
    setError(message);
    setSuccess("");
  };

  async function addAdmin(e) {
    e.preventDefault();

    if (!email || !password) {
      showError("Please fill in all required fields");
      return;
    }

    if (currentRole !== "super") {
      showError("Only Super Admins can create new admin accounts");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setActionLoading("create");

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Check if admin already exists in local list
      if (admins.some((admin) => admin.email === normalizedEmail)) {
        showError("An admin with this email already exists");
        return;
      }

      // Create user in Firebase Auth
      const result = await createAdminUser(normalizedEmail, password);

      if (result.success) {
        try {
          // Write admin record to Firestore
          await setDoc(doc(db, "admins", result.user.uid), {
            email: normalizedEmail,
            role: role,
            uid: result.user.uid,
            createdAt: new Date(),
            createdBy: currentUser?.uid || "system",
          });

          resetForm();
          showSuccess(
            `Admin "${normalizedEmail}" created successfully! They can now log in with their credentials.`
          );
        } catch (firestoreError) {
          console.error("Firestore error:", firestoreError);
          showError(
            `Admin account created in Firebase Auth but failed to save admin record. Error: ${firestoreError.message}`
          );
        }
      } else {
        showError(result.error || "Failed to create admin account");
      }
    } catch (err) {
      console.error("Admin creation error:", err);
      showError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setActionLoading(null);
    }
  }

  async function removeAdmin(admin) {
    if (currentRole !== "super") {
      showError("Only Super Admins can delete admin accounts");
      return;
    }

    if (admin.role === "super") {
      showError("Super Admin accounts cannot be deleted");
      return;
    }

    if (admin.uid === currentUser?.uid) {
      showError("You cannot delete your own admin account");
      return;
    }

    setActionLoading(`delete-${admin.id}`);

    try {
      await deleteDoc(doc(db, "admins", admin.id));
      showSuccess(`Admin "${admin.email}" deleted successfully!`);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Delete error:", error);
      showError("Failed to delete admin account");
    } finally {
      setActionLoading(null);
    }
  }

  async function changePassword(admin) {
    if (!newPassword) {
      showError("Please enter a new password");
      return;
    }

    if (currentRole !== "super") {
      showError("Only Super Admins can change admin passwords");
      return;
    }

    if (newPassword.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    setActionLoading(`password-${admin.id}`);

    try {
      const result = await changeAdminPassword(admin.email, newPassword);
      if (result.success) {
        setNewPassword("");
        setEditingAdmin(null);
        showSuccess(`Password for "${admin.email}" updated successfully!`);
      } else {
        showError(result.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      showError("Failed to update password. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  const canModifyAdmin = (admin) => {
    if (currentRole !== "super") return false;
    if (admin.role === "super" && admin.uid !== currentUser?.uid) return false;
    return true;
  };

  const isCurrentUser = (admin) => admin.uid === currentUser?.uid;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            👥 Admin Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage admin accounts and permissions
            {currentRole === "super" && " - You have Super Admin privileges"}
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Admin Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Add New Admin
          </h2>

          {currentRole !== "super" ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-gray-600">
                Read-only access. Only Super Admins can create new admin
                accounts.
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={addAdmin} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    >
                      <option value="normal">Normal Admin</option>
                      <option value="super">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === "create" ? (
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
                        Creating...
                      </span>
                    ) : (
                      "Create Admin"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="border border-gray-300 text-gray-700 rounded-lg px-6 py-3 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Admin List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Admin Accounts ({admins.length})
            </h2>
          </div>

          {admins.length === 0 ? (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No admin accounts
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {currentRole === "super"
                  ? "Get started by creating your first admin account."
                  : "No admin accounts have been created yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {admin.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created{" "}
                            {admin.createdAt
                              ?.toDate?.()
                              ?.toLocaleDateString() || "Unknown"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            admin.role === "super"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {admin.role === "super"
                            ? "⭐ Super Admin"
                            : "🛡️ Normal Admin"}
                          {isCurrentUser(admin) && " (You)"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center text-green-600">
                          <svg
                            className="h-3 w-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 8 8"
                          >
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() =>
                            setEditingAdmin(
                              editingAdmin === admin.id ? null : admin.id
                            )
                          }
                          disabled={!canModifyAdmin(admin) || actionLoading}
                          className={`text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            !canModifyAdmin(admin)
                              ? "text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                          title={
                            !canModifyAdmin(admin)
                              ? "You cannot modify this admin"
                              : "Change password"
                          }
                        >
                          Change Password
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(admin.id)}
                          disabled={
                            !canModifyAdmin(admin) ||
                            actionLoading ||
                            isCurrentUser(admin)
                          }
                          className={`text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            !canModifyAdmin(admin) || isCurrentUser(admin)
                              ? "text-gray-400 cursor-not-allowed"
                              : ""
                          }`}
                          title={
                            isCurrentUser(admin)
                              ? "You cannot delete your own account"
                              : !canModifyAdmin(admin)
                              ? "You cannot delete this admin"
                              : "Delete admin"
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Change Password Modal */}
        {editingAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    minLength={6}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum 6 characters
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditingAdmin(null);
                      setNewPassword("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      changePassword(admins.find((a) => a.id === editingAdmin))
                    }
                    disabled={!newPassword || actionLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === `password-${editingAdmin}`
                      ? "Updating..."
                      : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete admin account{" "}
                <strong>
                  {admins.find((a) => a.id === deleteConfirm)?.email}
                </strong>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    removeAdmin(admins.find((a) => a.id === deleteConfirm))
                  }
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading === `delete-${deleteConfirm}`
                    ? "Deleting..."
                    : "Delete Admin"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
