import { useState } from "react";
import { useAuth } from "../../context/AuthContextBase";

export default function DepartmentForm() {
  const { role } = useAuth();
  const [formData, setFormData] = useState({
    departmentName: "",
    shortDescription: "",
    detailedDescription: "",
    telegramLink: "",
    category: "general",
    tags: "",
  });
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    bio: "",
    avatar: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  // Auto-dismiss messages
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      const file = files[0];
      setNewMember(prev => ({ ...prev, [name]: file }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMemberInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      const file = files[0];
      setNewMember(prev => ({ ...prev, [name]: file }));
    } else {
      setNewMember(prev => ({ ...prev, [name]: value }));
    }
  };

  const addTeamMember = () => {
    if (!newMember.name || !newMember.role) {
      showMessage("Please fill in at least name and role for the team member", "error");
      return;
    }

    const member = {
      id: Date.now().toString(),
      ...newMember,
      avatar: newMember.avatar ? URL.createObjectURL(newMember.avatar) : null,
    };

    setTeamMembers(prev => [...prev, member]);
    setNewMember({ name: "", role: "", bio: "", avatar: null });
    setShowAddMember(false);
    showMessage("Team member added successfully", "success");
  };

  const removeTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    showMessage("Team member removed", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      showMessage("Department added successfully! (This is a demo - no data was saved)", "success");
      
      // Reset form
      setFormData({
        departmentName: "",
        shortDescription: "",
        detailedDescription: "",
        telegramLink: "",
        category: "general",
        tags: "",
      });
      setTeamMembers([]);
    }, 1500);
  };

  const clearForm = () => {
    setFormData({
      departmentName: "",
      shortDescription: "",
      detailedDescription: "",
      telegramLink: "",
      category: "general",
      tags: "",
    });
    setTeamMembers([]);
    setNewMember({ name: "", role: "", bio: "", avatar: null });
    setShowAddMember(false);
  };

  // Only show for Super Admins
  if (role !== "super") {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">Only Super Admins can create and manage departments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">Create Department</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Access Level:</span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Super Admin
          </span>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          messageType === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            {messageType === "success" ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            )}
          </svg>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Department Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-black border-b border-gray-200 pb-2">
            Department Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Department Name *
              </label>
              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                placeholder="e.g., Marketing, Development, Design"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="creative">Creative</option>
                <option value="management">Management</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Short Description *
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
              placeholder="Brief description of the department's purpose..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Detailed Description *
            </label>
            <textarea
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
              placeholder="Comprehensive description of the department's responsibilities, goals, and structure..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Telegram Link
              </label>
              <input
                type="url"
                name="telegramLink"
                value={formData.telegramLink}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                placeholder="https://t.me/department_chat"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                placeholder="Enter tags separated by commas"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-black border-b border-gray-200 pb-2">
              Team Members ({teamMembers.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowAddMember(!showAddMember)}
              className="px-4 py-2 bg-[#d4af37] text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 font-medium"
            >
              {showAddMember ? "Cancel" : "Add Team Member"}
            </button>
          </div>

          {/* Add Team Member Form */}
          {showAddMember && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-black">Add New Team Member</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newMember.name}
                    onChange={handleMemberInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Role / Field *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={newMember.role}
                    onChange={handleMemberInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                    placeholder="e.g., Lead Developer, Designer, Manager"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Bio / Details
                </label>
                <textarea
                  name="bio"
                  value={newMember.bio}
                  onChange={handleMemberInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                  placeholder="Brief bio or additional details about the team member..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Avatar (Optional)
                </label>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleMemberInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Add Member
                </button>
              </div>
            </div>
          )}

          {/* Team Members List */}
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center">
                          <span className="text-black font-medium text-sm">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-black">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(member.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {member.bio && (
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No team members added yet</p>
              <p className="text-sm">Click "Add Team Member" to get started</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={clearForm}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
          >
            Clear Form
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Department...
              </>
            ) : (
              "Add Department"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
