import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import DepartmentForm from "../../components/admin/DepartmentForm";

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch departments from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "departments"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDepartments(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading departments:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Auto-dismiss messages
  const showMessage = (text, type) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 4000);
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleDelete = async (departmentId, departmentName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${departmentName}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteDoc(doc(db, "departments", departmentId));
        showMessage("Department deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting department:", error);
        showMessage("Error deleting department. Please try again.", "error");
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDepartment(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingDepartment(null);
    showMessage(
      editingDepartment
        ? "Department updated successfully!"
        : "Department created successfully!",
      "success"
    );
  };

  const totalMembers = departments.reduce(
    (sum, dept) => sum + (dept.numberOfMembers || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Department Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage departments, teams, and organizational structure
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Add Department
            </button>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              🏢 Departments
            </span>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {message.type === "success" ? "✅" : "❌"}
            </span>
            {message.text}
          </div>
        </div>
      )}

      {/* Department Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingDepartment
                  ? "Edit Department"
                  : "Create New Department"}
              </h2>
              <button
                onClick={handleFormClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <DepartmentForm
                editingDepartment={editingDepartment}
                onSuccess={handleFormSuccess}
                onCancel={handleFormClose}
              />
            </div>
          </div>
        </div>
      )}

      {/* Department Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Department Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">
                  Total Departments
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {departments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {totalMembers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-900">
                  Avg per Dept
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {departments.length > 0
                    ? Math.round(totalMembers / departments.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">
                  Active Depts
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {departments.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Departments List
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading departments...</p>
          </div>
        ) : departments.length > 0 ? (
          <div className="space-y-4">
            {departments.map((department) => (
              <div
                key={department.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{department.icon || "🏢"}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {department.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Manager: {department.manager} •{" "}
                        {department.numberOfMembers} members
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {department.description?.substring(0, 100)}
                        {department.description?.length > 100 && "..."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(department)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(department.id, department.name)
                      }
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">🏢</span>
            <p className="text-lg font-medium">No departments created yet</p>
            <p className="text-sm">
              Click "Add Department" to create your first department
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
