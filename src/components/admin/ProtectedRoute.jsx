import { useAuth } from "../../context/AuthContextBase";

export default function ProtectedRoute({ children, requireSuper = false }) {
  const { currentUser, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-primary-500 rounded-full" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Authentication Required</h1>
          <p className="text-gray-600">Please log in to access the admin panel.</p>
          <a href="/admin/login" className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Unauthorized</h1>
          <p className="text-gray-600">Your account doesn't have admin access.</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (requireSuper && role !== "super") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
          <p className="text-gray-600">You need super admin privileges to access this page.</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}


