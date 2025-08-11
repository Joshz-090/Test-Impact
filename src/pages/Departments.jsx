const Departments = () => {
  const departments = [
    {
      id: 1,
      name: 'Art Department',
      description: 'Our artistic visionaries who curate exhibitions and create stunning visual experiences that inspire and connect communities across Ethiopia.',
      icon: '🎨',
      teamSize: '5 Members',
      specialties: [
        'Art Curation',
        'Exhibition Design',
        'Artist Coordination',
        'Gallery Management',
        'Art Installation',
        'Creative Direction'
      ],
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      name: 'Design & Marketing Department',
      description: 'Our creative powerhouse that transforms ideas into compelling visual stories and strategic marketing campaigns.',
      icon: '🖌',
      teamSize: '8 Members',
      specialties: [
        'Brand Identity Design',
        'Digital Marketing',
        'Social Media Strategy',
        'Content Creation',
        'Print Design',
        'Marketing Analytics'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      name: 'Event Organizing Department',
      description: 'Specialists in creating unforgettable experiences through meticulous planning and innovative event concepts.',
      icon: '📆',
      teamSize: '6 Members',
      specialties: [
        'Event Planning & Coordination',
        'Venue Selection',
        'Logistics Management',
        'Brand Activation',
        'Corporate Events',
        'Art Exhibitions'
      ],
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 4,
      name: 'IT & Web Development Department',
      description: 'Our technology experts who build cutting-edge digital solutions and innovative web experiences.',
      icon: '💻',
      teamSize: '7 Members',
      specialties: [
        'Web Development',
        'Mobile App Development',
        'UI/UX Design',
        'E-commerce Solutions',
        'Custom Software',
        'Digital Infrastructure'
      ],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 5,
      name: 'Construction & Architecture Department',
      description: 'Our skilled craftsmen who bring architectural visions to life through innovative construction and interior design.',
      icon: '🏗️',
      teamSize: '9 Members',
      specialties: [
        'Interior Design',
        'Space Planning',
        'Custom Construction',
        'Renovation Projects',
        'Material Selection',
        'Project Management'
      ],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      color: 'from-red-500 to-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 font-['Montserrat']">
            Our <span className="text-[#D4AF37]">Departments</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto">
            Specialized teams working together to deliver exceptional creative solutions across Ethiopia
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={dept.image} 
                    alt={dept.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 text-4xl">{dept.icon}</div>
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {dept.teamSize}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-black mb-3 font-['Montserrat']">{dept.name}</h3>
                  <p className="text-gray-700 mb-4">{dept.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#D4AF37] mb-2 uppercase tracking-wide">Specialties</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {dept.specialties.map((specialty, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2"></div>
                          {specialty}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors">
                    Meet the Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Cross-Department Collaboration
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              How our specialized teams work together to deliver comprehensive solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Unified Vision</h3>
              <p className="text-gray-700">All departments align under a shared creative vision to ensure cohesive project delivery.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Seamless Integration</h3>
              <p className="text-gray-700">Our teams work in harmony, combining expertise to create innovative, multi-faceted solutions.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Quality Assurance</h3>
              <p className="text-gray-700">Each department maintains high standards while contributing to overall project excellence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Department Stats */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-['Montserrat']">
              Department <span className="text-[#D4AF37]">Overview</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our specialized teams at a glance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="text-center">
                <div className="text-4xl mb-4">{dept.icon}</div>
                <h3 className="text-lg font-semibold mb-2 font-['Montserrat']">{dept.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{dept.teamSize}</p>
                <div className="text-xs text-gray-500">
                  {dept.specialties.slice(0, 2).map((specialty, index) => (
                    <div key={index} className="mb-1">{specialty}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 font-['Montserrat']">
            Join Our Creative Team
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for talented individuals who share our passion for creativity and innovation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors shadow-lg text-lg">
              View Open Positions
            </button>
            <button className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors text-lg">
              Send Your Portfolio
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Departments 