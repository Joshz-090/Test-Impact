import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { createAdminInDatabase, checkAdminExists } from "../../utils/setupAdmin";

export default function AdminSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("normal");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSetup(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Check if admin already exists in database
      const exists = await checkAdminExists(email);
      if (exists) {
        setError("Admin with this email already exists in the database.");
        setLoading(false);
        return;
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create admin record in Firestore
      const result = await createAdminInDatabase(email, role);
      
      if (result.success) {
        setMessage(`Admin created successfully! Email: ${email}, Role: ${role}`);
        setEmail("");
        setPassword("");
      } else {
        setError(`Failed to create admin record: ${result.error}`);
        // Clean up the auth user if database creation failed
        await userCredential.user.delete();
      }
    } catch (error) {
      setError(error.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">Admin Setup</h1>
        
        {message && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSetup}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              minLength={6}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="normal">Normal Admin</option>
              <option value="super">Super Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          >
            {loading ? "Creating Admin..." : "Create Admin"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/admin/login" className="text-blue-600 hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
}
