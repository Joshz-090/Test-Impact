import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ProtectedRoute from "../../components/admin/ProtectedRoute";
import { createAdminUser, changeAdminPassword } from "../../utils/adminUtils";
import { useAuth } from "../../context/AuthContextBase";

export default function Admins() {
  // Allow both super and normal admins to view this page. Critical actions are checked inside.
  return (
    <ProtectedRoute>
      <AdminsInner />
    </ProtectedRoute>
  );
}

function AdminsInner() {
  const { role: currentRole } = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("normal")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [admins, setAdmins] = useState([])
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [newPassword, setNewPassword] = useState("")

  // Auto dismiss feedback after a few seconds
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 3500)
      return () => clearTimeout(t)
    }
  }, [success])
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 4500)
      return () => clearTimeout(t)
    }
  }, [error])

  useEffect(() => {
    const coll = collection(db, "admins")
    const q = query(coll, orderBy("email", "asc"))
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setAdmins(rows)
    })
    return () => unsub()
  }, [])

  async function addAdmin(e) {
    e.preventDefault()
    if (!email || !password) return
    if (currentRole !== "super") {
      setError("Only Super Admins can create admins")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      // Create user in Firebase Auth
      const result = await createAdminUser(email.trim().toLowerCase(), password)
      
      if (result.success) {
        try {
          // Write admin record by UID for secure rules
          await setDoc(doc(db, "admins", result.user.uid), {
            email: email.trim().toLowerCase(),
            role: role,
            uid: result.user.uid,
            createdAt: new Date()
          })
          
          setEmail("")
          setPassword("")
          setRole("normal")
          setSuccess("Admin created successfully! They can now log in with their credentials.")
        } catch (firestoreError) {
          console.error("Firestore error:", firestoreError)
          setError(`Admin user created in Firebase Auth but failed to save admin record. Error: ${firestoreError.message}. Please check Firestore security rules or manually add the admin record.`)
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error("Admin creation error:", err)
      setError(err.message || "Failed to create admin")
    } finally {
      setLoading(false)
    }
  }

  async function removeAdmin(admin) {
    if (currentRole !== "super") {
      setError("Only Super Admins can delete admins")
      return
    }
    if (admin.role === "super" && currentRole !== "super") {
      setError("You cannot delete a Super Admin")
      return
    }
    if (!window.confirm(`Delete admin ${admin.email}? This action cannot be undone.`)) return
    try {
      await deleteDoc(doc(db, "admins", admin.id))
      setSuccess("Admin deleted successfully!")
    } catch {
      setError("Failed to delete admin")
    }
  }

  async function changePassword(admin) {
    if (!newPassword) {
      setError("Please enter a new password")
      return
    }
    if (currentRole !== "super") {
      setError("Only Super Admins can change admin passwords")
      return
    }
    if (admin.role === "super" && currentRole !== "super") {
      setError("You cannot change a Super Admin password")
      return
    }
    if (!window.confirm(`Change password for ${admin.email}?`)) return
    
    setLoading(true)
    setError("")
    
    try {
      const result = await changeAdminPassword(admin.email, newPassword)
      if (result.success) {
        setNewPassword("")
        setEditingAdmin(null)
        setSuccess("Password updated successfully!")
      } else {
        setError(result.error)
      }
    } catch {
      setError("Failed to update password. Make sure the admin account exists in Firebase Auth.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admins</h1>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 text-sm p-3 rounded">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Add New Admin</h2>
        {currentRole !== "super" ? (
          <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 p-3 rounded">
            Read-only access. Only Super Admins can add new admins.
          </div>
        ) : (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> If you get "Missing or insufficient permissions" error, 
                the admin user will still be created in Firebase Auth but the admin record might not be saved to Firestore. 
                In that case, you can manually add the admin record using the Firebase Console.
              </p>
            </div>
            <form onSubmit={addAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Admin email" 
                  className="w-full border rounded px-3 py-2" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Admin password" 
                  className="w-full border rounded px-3 py-2" 
                  required 
                  minLength={6}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
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
                disabled={loading} 
                className="bg-black text-white rounded px-4 py-2 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Admin"}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Troubleshooting Admin Login Issues</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>If admin creation shows "Missing or insufficient permissions":</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>The user is created in Firebase Auth but the admin record might not be saved to Firestore</li>
            <li>Check the browser console for detailed error messages</li>
            <li>Go to Firebase Console → Firestore Database → admins collection</li>
            <li>Manually add a document with the admin's email, role, and UID from Firebase Auth</li>
            <li>Or contact the developer to fix Firestore security rules</li>
          </ol>
          <p className="mt-3"><strong>If admin can't login after creation:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Verify the admin record exists in Firestore admins collection</li>
            <li>Check that the email in Firestore matches exactly (lowercase)</li>
            <li>Ensure the role field is set to "super" or "normal"</li>
            <li>Verify the UID matches the one in Firebase Auth</li>
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left p-3 text-sm font-medium text-gray-600">Role</th>
              <th className="p-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.email}</td>
                <td className="p-3 text-sm text-gray-600 capitalize">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    a.role === "super" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {a.role === "super" ? (
                      <span aria-hidden>⭐</span>
                    ) : (
                      <span aria-hidden>🛡️</span>
                    )}
                    {a.role === "super" ? "Super Admin" : "Normal Admin"}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button 
                    onClick={() => setEditingAdmin(editingAdmin === a.id ? null : a.id)} 
                    className={`hover:underline ${currentRole !== "super" ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
                    disabled={currentRole !== "super"}
                    title={currentRole !== "super" ? "Only Super Admins can change passwords" : "Change Password"}
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={() => removeAdmin(a)} 
                    className={`hover:underline ${currentRole !== "super" ? "text-gray-400 cursor-not-allowed" : "text-red-600"}`}
                    disabled={currentRole !== "super"}
                    title={currentRole !== "super" ? "Only Super Admins can delete admins" : "Delete admin"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingAdmin && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Change Password</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Password changes require the admin to sign in and change their own password, 
              or you can delete and recreate the admin account with a new password.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Enter new password" 
                className="w-full border rounded px-3 py-2" 
                minLength={6}
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => changePassword(admins.find(a => a.id === editingAdmin))}
                disabled={loading || !newPassword || currentRole !== "super"}
                className={`text-white rounded px-4 py-2 disabled:opacity-60 ${currentRole !== "super" ? "bg-gray-400" : "bg-black"}`}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button 
                onClick={() => {
                  setEditingAdmin(null)
                  setNewPassword("")
                }}
                className="border rounded px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}