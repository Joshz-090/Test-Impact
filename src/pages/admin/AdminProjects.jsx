import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState("");
  const [noteInputs, setNoteInputs] = useState({});
  const [noteDates, setNoteDates] = useState({});
  const [savingNote, setSavingNote] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch projects
  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects: " + error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Filter projects based on search and filters
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter (seen/unseen)
    if (statusFilter === "unseen") {
      filtered = filtered.filter((project) => !project.seen);
    } else if (statusFilter === "seen") {
      filtered = filtered.filter((project) => project.seen);
    }

    // Event type filter
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.eventType === eventTypeFilter
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, eventTypeFilter]);

  const toggleExpand = async (project) => {
    setExpandedId(expandedId === project.id ? null : project.id);

    // Mark as seen when expanded
    if (!project.seen && expandedId !== project.id) {
      try {
        await updateDoc(doc(db, "projects", project.id), { seen: true });
        // Update local state immediately for better UX
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, seen: true } : p))
        );
      } catch (error) {
        console.error("Error marking project as seen:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await deleteDoc(doc(db, "projects", id));
      setSuccess("Project deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete project: " + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const copyToClipboard = (text, label) => {
    if (!text) {
      setError("No text to copy");
      return;
    }
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleNoteChange = (id, value) => {
    setNoteInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleNoteDateChange = (id, value) => {
    setNoteDates((prev) => ({ ...prev, [id]: value }));
  };

  const saveNote = async (id) => {
    const note = (noteInputs[id] || "").trim();
    const noteDate = noteDates[id] || new Date().toISOString().split("T")[0];

    if (!note) {
      setError("Please enter a note before saving.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setSavingNote((prev) => ({ ...prev, [id]: true }));
    try {
      await updateDoc(doc(db, "projects", id), {
        note,
        noteDate,
        lastUpdated: new Date(),
      });

      // Update local state
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? { ...project, note, noteDate } : project
        )
      );

      setNoteInputs((prev) => ({ ...prev, [id]: "" }));
      setSuccess("Note saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error saving note:", error);
      setError("Failed to save note: " + error.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setSavingNote((prev) => ({ ...prev, [id]: false }));
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setEventTypeFilter("all");
  };

  const getEventTypes = () => {
    const types = [
      ...new Set(projects.map((p) => p.eventType).filter(Boolean)),
    ];
    return types.sort();
  };

  const markAllAsSeen = async () => {
    try {
      const unseenProjects = projects.filter((p) => !p.seen);
      const updatePromises = unseenProjects.map((project) =>
        updateDoc(doc(db, "projects", project.id), { seen: true })
      );

      await Promise.all(updatePromises);

      // Update local state
      setProjects((prev) => prev.map((p) => ({ ...p, seen: true })));
      setSuccess("All projects marked as seen");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error marking all as seen:", error);
      setError("Failed to mark all as seen: " + error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const unseenCount = projects.filter((p) => !p.seen).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-black">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            📂 Admin - Projects ({filteredProjects.length})
          </h1>
          {unseenCount > 0 && (
            <div className="inline-flex items-center bg-[#d4af37] text-black px-4 py-2 rounded-full mb-4">
              <span className="font-semibold">
                {unseenCount} new project(s)
              </span>
              <button
                onClick={markAllAsSeen}
                className="ml-3 px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
              >
                Mark all as seen
              </button>
            </div>
          )}
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

        {/* Filters */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or details..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
              >
                <option value="all">All Status</option>
                <option value="unseen">Unseen Only</option>
                <option value="seen">Seen Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
              >
                <option value="all">All Event Types</option>
                {getEventTypes().map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {projects.length === 0
                ? "No projects submitted yet."
                : "No projects match your filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`p-6 border rounded-xl shadow-lg bg-white cursor-pointer transition-all hover:shadow-xl ${
                  project.seen ? "border-gray-300" : "border-[#d4af37] border-2"
                } ${expandedId === project.id ? "ring-2 ring-[#d4af37]" : ""}`}
                onClick={() => toggleExpand(project)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) =>
                  (e.key === "Enter" || e.key === " ") && toggleExpand(project)
                }
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-black">
                      {project.name}
                    </h2>
                    {!project.seen && (
                      <span className="bg-[#d4af37] text-black px-3 py-1 rounded-full text-sm font-medium">
                        NEW
                      </span>
                    )}
                    {project.note && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        HAS NOTE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">
                      {project.createdAt?.toDate().toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(project.id);
                      }}
                      disabled={deleteLoading === project.id}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors duration-300 disabled:opacity-50"
                    >
                      {deleteLoading === project.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Quick info - always visible */}
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>📧 {project.email}</span>
                  <span>📞 {project.phone}</span>
                  <span>🎯 {project.eventType}</span>
                </div>

                {/* Expanded Details */}
                {expandedId === project.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-black mb-3">
                          Project Details
                        </h3>
                        <div className="space-y-3">
                          <p>
                            <span className="font-medium">Email:</span>
                            <span className="ml-2 text-[#d4af37]">
                              {project.email}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  project.email,
                                  `email-${project.id}`
                                );
                              }}
                              className="ml-3 text-sm text-gray-600 hover:text-[#d4af37] transition-colors"
                            >
                              📋 Copy
                            </button>
                            {copied === `email-${project.id}` && (
                              <span className="ml-2 text-sm text-[#d4af37]">
                                Copied!
                              </span>
                            )}
                          </p>

                          <p>
                            <span className="font-medium">Phone:</span>
                            <span className="ml-2">{project.phone}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  project.phone,
                                  `phone-${project.id}`
                                );
                              }}
                              className="ml-3 text-sm text-gray-600 hover:text-[#d4af37] transition-colors"
                            >
                              📋 Copy
                            </button>
                            {copied === `phone-${project.id}` && (
                              <span className="ml-2 text-sm text-[#d4af37]">
                                Copied!
                              </span>
                            )}
                          </p>

                          <p>
                            <span className="font-medium">Event Type:</span>
                            <span className="ml-2">{project.eventType}</span>
                          </p>

                          <p>
                            <span className="font-medium">Departments:</span>
                            <span className="ml-2">
                              {project.departments?.join(", ") ||
                                "None specified"}
                            </span>
                          </p>

                          <p>
                            <span className="font-medium">Submitted:</span>
                            <span className="ml-2">
                              {project.createdAt?.toDate().toLocaleString() ||
                                "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-black mb-3">
                          Project Description
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {project.details || "No details provided"}
                        </p>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-6">
                      <h3 className="font-semibold text-black mb-3">
                        Admin Notes
                      </h3>

                      {project.note ? (
                        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                          <p className="text-sm">
                            <span className="font-medium">Note:</span>{" "}
                            {project.note}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Date:</span>{" "}
                            {project.noteDate}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm italic text-gray-600 mb-4">
                          No note added yet.
                        </p>
                      )}

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add/Edit Note
                          </label>
                          <textarea
                            value={noteInputs[project.id] || project.note || ""}
                            onChange={(e) =>
                              handleNoteChange(project.id, e.target.value)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
                            rows="3"
                            placeholder="Enter your notes about this project..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Note Date
                            </label>
                            <input
                              type="date"
                              value={
                                noteDates[project.id] ||
                                project.noteDate ||
                                new Date().toISOString().split("T")[0]
                              }
                              onChange={(e) =>
                                handleNoteDateChange(project.id, e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
                            />
                          </div>

                          <div className="flex items-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                saveNote(project.id);
                              }}
                              disabled={savingNote[project.id]}
                              className="w-full px-4 py-3 bg-[#d4af37] text-black font-semibold rounded-md hover:bg-black hover:text-white transition-colors duration-300 disabled:opacity-50"
                            >
                              {savingNote[project.id]
                                ? "Saving..."
                                : "Save Note"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-black mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this project? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteLoading === deleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteLoading === deleteConfirm ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
