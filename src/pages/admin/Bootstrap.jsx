import { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContextBase";

export default function Bootstrap() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bootstrapStatus, setBootstrapStatus] = useState(null);

  const checkBootstrapStatus = async () => {
    try {
      const bootstrapDoc = await getDoc(doc(db, "settings", "bootstrap"));
      if (bootstrapDoc.exists()) {
        setBootstrapStatus(bootstrapDoc.data().enabled ? "enabled" : "disabled");
      } else {
        setBootstrapStatus("not-set");
      }
    } catch (error) {
      console.error("Error checking bootstrap status:", error);
      setBootstrapStatus("error");
    }
  };

  const enableBootstrap = async () => {
    setLoading(true);
    setMessage("");
    try {
      await setDoc(doc(db, "settings", "bootstrap"), { enabled: true });
      setMessage("Bootstrap mode enabled! You can now create your first super admin.");
      setBootstrapStatus("enabled");
    } catch (error) {
      console.error("Error enabling bootstrap:", error);
      setMessage("Failed to enable bootstrap mode. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  const disableBootstrap = async () => {
    setLoading(true);
    setMessage("");
    try {
      await setDoc(doc(db, "settings", "bootstrap"), { enabled: false });
      setMessage("Bootstrap mode disabled. Only super admins can now create admins.");
      setBootstrapStatus("disabled");
    } catch (error) {
      console.error("Error disabling bootstrap:", error);
      setMessage("Failed to disable bootstrap mode. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  // Check bootstrap status on component mount
  useState(() => {
    checkBootstrapStatus();
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to access the bootstrap setup.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bootstrap Setup</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">What is Bootstrap Mode?</h2>
        <p className="text-blue-800 text-sm">
          Bootstrap mode allows you to create your first super admin account. 
          After creating your first super admin, you should disable bootstrap mode for security.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Current Status</h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium">Bootstrap Mode:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            bootstrapStatus === "enabled" ? "bg-green-100 text-green-800" :
            bootstrapStatus === "disabled" ? "bg-red-100 text-red-800" :
            bootstrapStatus === "not-set" ? "bg-yellow-100 text-yellow-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {bootstrapStatus === "enabled" ? "Enabled" :
             bootstrapStatus === "disabled" ? "Disabled" :
             bootstrapStatus === "not-set" ? "Not Set" :
             "Error"}
          </span>
        </div>
        
        <button
          onClick={checkBootstrapStatus}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Refresh Status
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={enableBootstrap}
          disabled={loading || bootstrapStatus === "enabled"}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Enable Bootstrap Mode"}
        </button>

        <button
          onClick={disableBootstrap}
          disabled={loading || bootstrapStatus === "disabled"}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Disable Bootstrap Mode"}
        </button>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Instructions</h3>
        <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
          <li>Enable bootstrap mode</li>
          <li>Go to the Admins page and create your first super admin</li>
          <li>Disable bootstrap mode for security</li>
          <li>From now on, only super admins can create new admins</li>
        </ol>
      </div>
    </div>
  );
}
