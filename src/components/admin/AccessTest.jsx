import { useAuth } from "../../context/AuthContextBase";

export default function AccessTest() {
  const { currentUser, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm">
      <h3 className="font-medium mb-2">Access Control Test</h3>
      <div className="space-y-1">
        <div>User: {currentUser ? currentUser.email : "Not logged in"}</div>
        <div>Role: {role || "No role"}</div>
        <div>Can access admins: {role === "super" ? "Yes" : "No"}</div>
        <div>Can manage subscribers: {role ? "Yes" : "No"}</div>
      </div>
    </div>
  );
}
