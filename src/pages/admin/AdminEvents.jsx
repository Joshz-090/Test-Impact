import { useState, useEffect } from "react";
import EventPromotionForm from "../../components/admin/EventPromotionForm";
import { getEvents, deleteEvent } from "../../utils/eventUtils";
import toast from "react-hot-toast";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filter, setFilter] = useState("all"); // all, upcoming, past

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const result = await getEvents();
      if (result.success) {
        setEvents(result.events);
      } else {
        toast.error("Failed to load events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("An error occurred while loading events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle event deletion
  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      try {
        const result = await deleteEvent(eventId);
        if (result.success) {
          toast.success("Event deleted successfully");
          fetchEvents(); // Refresh the list
        } else {
          toast.error(result.error || "Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("An error occurred while deleting the event");
      }
    }
  };

  // Handle event edit
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  // Handle form submission
  const handleEventSaved = () => {
    setShowForm(false);
    setEditingEvent(null);
    fetchEvents(); // Refresh the list
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const eventDate = new Date(event.eventDate);

    switch (filter) {
      case "upcoming":
        return eventDate > now;
      case "past":
        return eventDate <= now;
      default:
        return true;
    }
  });

  // Format date for display
  const formatDate = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString || "00:00"}`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Event Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Create and manage event promotions and announcements
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New Event
            </button>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              🎉 Events
            </span>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
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
              <EventPromotionForm
                eventToEdit={editingEvent}
                onEventSaved={handleEventSaved}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4">
          {[
            { key: "all", label: "All Events", count: events.length },
            {
              key: "upcoming",
              label: "Upcoming",
              count: events.filter((e) => new Date(e.eventDate) > new Date())
                .length,
            },
            {
              key: "past",
              label: "Past Events",
              count: events.filter((e) => new Date(e.eventDate) <= new Date())
                .length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Events List</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No events found. Create your first event!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          new Date(event.eventDate) > new Date()
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {new Date(event.eventDate) > new Date()
                          ? "Upcoming"
                          : "Past"}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {event.category}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-2">
                      {event.shortDescription}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        📅 {formatDate(event.eventDate, event.eventTime)}
                      </span>
                      <span>📍 {event.location}</span>
                      <span>👤 {event.organizerName}</span>
                      {event.images && event.images.length > 0 && (
                        <span>🖼️ {event.images.length} image(s)</span>
                      )}
                      {event.videoLink && <span>🎥 Video included</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id, event.title)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Event Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {events.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    events.filter((e) => new Date(e.eventDate) > new Date())
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🖼️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">
                  Total Images
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {events.reduce(
                    (sum, event) => sum + (event.images?.length || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
