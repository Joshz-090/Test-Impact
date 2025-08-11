import { useState } from 'react'

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null)

  const events = [
    {
      id: 1,
      title: 'Spring Art Exhibition 2024',
      date: 'March 15-30, 2024',
      location: 'Contemporary Art Gallery',
      description: 'A celebration of contemporary art featuring local and international artists. This exhibition showcases innovative works across various mediums including painting, sculpture, digital art, and installations.',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      status: 'upcoming',
      category: 'Exhibition',
      attendees: '500+',
      gallery: [
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 2,
      title: 'Design Week Conference',
      date: 'April 10-12, 2024',
      location: 'Convention Center',
      description: 'Join industry leaders for three days of design innovation and networking. Features keynote speakers, workshops, and networking opportunities for creative professionals.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      status: 'upcoming',
      category: 'Conference',
      attendees: '300+',
      gallery: [
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 3,
      title: 'Digital Art Workshop',
      date: 'May 5, 2024',
      location: 'Creative Studio',
      description: 'Learn the latest digital art techniques from our expert team. Hands-on workshop covering digital painting, 3D modeling, and animation fundamentals.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      status: 'upcoming',
      category: 'Workshop',
      attendees: '50',
      gallery: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 4,
      title: 'Winter Art Festival',
      date: 'December 15-20, 2023',
      location: 'City Plaza',
      description: 'A magical winter celebration featuring ice sculptures, light installations, and interactive art experiences. Family-friendly event with activities for all ages.',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      status: 'past',
      category: 'Festival',
      attendees: '1000+',
      gallery: [
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 5,
      title: 'Architecture Symposium',
      date: 'November 8-10, 2023',
      location: 'Design Institute',
      description: 'Exploring the future of sustainable architecture and urban design. Presentations from leading architects and urban planners on innovative design solutions.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      status: 'past',
      category: 'Symposium',
      attendees: '200+',
      gallery: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
      ]
    },
    {
      id: 6,
      title: 'Tech & Art Fusion',
      date: 'October 20, 2023',
      location: 'Innovation Hub',
      description: 'Exploring the intersection of technology and art through interactive installations, VR experiences, and AI-generated artwork demonstrations.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      status: 'past',
      category: 'Exhibition',
      attendees: '150+',
      gallery: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
      ]
    }
  ]

  const upcomingEvents = events.filter(event => event.status === 'upcoming')
  const pastEvents = events.filter(event => event.status === 'past')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 font-['Montserrat']">
            Our <span className="text-[#D4AF37]">Events</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto">
            Join us for inspiring exhibitions, workshops, and creative experiences
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Upcoming <span className="text-[#D4AF37]">Events</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mark your calendar for these exciting upcoming events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Upcoming
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="mr-4">📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#D4AF37] font-medium">{event.attendees} attendees</span>
                    <button 
                      onClick={() => setSelectedEvent(event)}
                      className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Past <span className="text-[#D4AF37]">Events</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Relive the magic of our previous events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Past
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span className="mr-4">📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#D4AF37] font-medium">{event.attendees} attendees</span>
                    <button 
                      onClick={() => setSelectedEvent(event)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      View Gallery
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
              >
                ×
              </button>
              <div className="h-64 bg-gray-200">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-black mb-4 font-['Montserrat']">{selectedEvent.title}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Event Details</h3>
                    <div className="space-y-2 text-gray-700">
                      <div><span className="font-medium">Date:</span> {selectedEvent.date}</div>
                      <div><span className="font-medium">Location:</span> {selectedEvent.location}</div>
                      <div><span className="font-medium">Category:</span> {selectedEvent.category}</div>
                      <div><span className="font-medium">Attendees:</span> {selectedEvent.attendees}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Description</h3>
                    <p className="text-gray-700">{selectedEvent.description}</p>
                  </div>
                </div>

                {/* Photo Gallery */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-4">Photo Gallery</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedEvent.gallery.map((image, index) => (
                      <div key={index} className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors">
                    {selectedEvent.status === 'upcoming' ? 'Register Now' : 'View Full Gallery'}
                  </button>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Stats */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-['Montserrat']">
              Event <span className="text-[#D4AF37]">Statistics</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our impact through events and experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">50+</div>
              <div className="text-gray-300">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">5000+</div>
              <div className="text-gray-300">Total Attendees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">100+</div>
              <div className="text-gray-300">Artists Featured</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">95%</div>
              <div className="text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 font-['Montserrat']">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to our newsletter to be the first to know about upcoming events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D4AF37]"
            />
            <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Events 