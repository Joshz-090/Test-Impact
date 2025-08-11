import { useState } from 'react'

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'graphic', label: 'Graphic Design' },
    { id: 'events', label: 'Events' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'web', label: 'Web Development' }
  ]

  const projects = [
    {
      id: 1,
      title: 'Modern Art Gallery Branding',
      category: 'graphic',
      description: 'Complete brand identity design for a contemporary art gallery, including logo, signage, and marketing materials.',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      client: 'Contemporary Art Gallery',
      year: '2024',
      technologies: ['Adobe Creative Suite', 'Brand Strategy', 'Print Design']
    },
    {
      id: 2,
      title: 'Tech Conference Event Design',
      category: 'events',
      description: 'Comprehensive event branding and design for a major technology conference with 500+ attendees.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      client: 'Tech Innovation Summit',
      year: '2024',
      technologies: ['Event Planning', 'Digital Design', '3D Visualization']
    },
    {
      id: 3,
      title: 'Luxury Hotel Interior Design',
      category: 'architecture',
      description: 'Complete interior design and renovation project for a boutique luxury hotel in the city center.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      client: 'Boutique Hotel Group',
      year: '2023',
      technologies: ['Interior Design', '3D Modeling', 'Project Management']
    },
    {
      id: 4,
      title: 'E-commerce Website Development',
      category: 'web',
      description: 'Modern, responsive e-commerce platform with advanced features and seamless user experience.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      client: 'Fashion Retailer',
      year: '2023',
      technologies: ['React', 'Node.js', 'E-commerce', 'UI/UX Design']
    },
    {
      id: 5,
      title: 'Corporate Identity Package',
      category: 'graphic',
      description: 'Complete corporate identity design including logo, business cards, letterheads, and brand guidelines.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      client: 'Financial Services Corp',
      year: '2023',
      technologies: ['Brand Identity', 'Print Design', 'Brand Guidelines']
    },
    {
      id: 6,
      title: 'Art Exhibition Installation',
      category: 'events',
      description: 'Large-scale art installation and exhibition design for a contemporary art museum.',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      client: 'Modern Art Museum',
      year: '2023',
      technologies: ['Installation Art', 'Spatial Design', 'Lighting Design']
    },
    {
      id: 7,
      title: 'Residential Complex Design',
      category: 'architecture',
      description: 'Modern residential complex design with sustainable features and community spaces.',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      client: 'Urban Development Co',
      year: '2023',
      technologies: ['Architecture', 'Sustainable Design', '3D Visualization']
    },
    {
      id: 8,
      title: 'Mobile App Development',
      category: 'web',
      description: 'Cross-platform mobile application for food delivery with advanced features and intuitive design.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      client: 'FoodTech Startup',
      year: '2023',
      technologies: ['React Native', 'Mobile Development', 'UI/UX Design']
    },
    {
      id: 9,
      title: 'Marketing Campaign Design',
      category: 'graphic',
      description: 'Comprehensive marketing campaign design including digital ads, social media graphics, and print materials.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      client: 'Consumer Goods Brand',
      year: '2023',
      technologies: ['Digital Design', 'Marketing Strategy', 'Social Media']
    }
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 font-['Montserrat']">
            Our <span className="text-[#D4AF37]">Portfolio</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto">
            Showcasing our creative excellence across diverse projects and industries
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <div className="text-2xl mb-2">👁️</div>
                      <div className="text-sm font-semibold">View Details</div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {project.year}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">{project.title}</h3>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#D4AF37] font-medium">{project.client}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">{project.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
              >
                ×
              </button>
              <div className="h-64 bg-gray-200">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-black mb-4 font-['Montserrat']">{selectedProject.title}</h2>
                <p className="text-gray-700 mb-6 text-lg">{selectedProject.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Project Details</h3>
                    <div className="space-y-2 text-gray-700">
                      <div><span className="font-medium">Client:</span> {selectedProject.client}</div>
                      <div><span className="font-medium">Year:</span> {selectedProject.year}</div>
                      <div><span className="font-medium">Category:</span> {selectedProject.category}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <span key={index} className="bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors">
                    View Full Case Study
                  </button>
                  <button 
                    onClick={() => setSelectedProject(null)}
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

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Portfolio <span className="text-[#D4AF37]">Statistics</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our impact through numbers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">500+</div>
              <div className="text-gray-700">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">50+</div>
              <div className="text-gray-700">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">15+</div>
              <div className="text-gray-700">Industries Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">98%</div>
              <div className="text-gray-700">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-['Montserrat']">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors shadow-lg text-lg">
              Start Your Project
            </button>
            <button className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors text-lg">
              Request Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Portfolio 