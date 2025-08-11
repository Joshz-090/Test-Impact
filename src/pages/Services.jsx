const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Art & Exhibition Creation',
      description: 'Curate and organize stunning art exhibitions that showcase Ethiopian talent and inspire audiences. From concept to execution, we handle every detail.',
      icon: '🎨',
      features: [
        'Exhibition Planning & Curation',
        'Artist Coordination',
        'Venue Selection & Setup',
        'Marketing & Promotion',
        'Opening Night Events',
        'Artwork Transportation'
      ],
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Event Organization & Branding',
      description: 'Create memorable brand experiences through strategic event planning and innovative branding solutions that leave lasting impressions.',
      icon: '📆',
      features: [
        'Brand Identity Development',
        'Event Concept Design',
        'Logistics Management',
        'Digital & Print Materials',
        'On-site Coordination',
        'Post-event Analysis'
      ],
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Graphic Design & Content Creation',
      description: 'Transform ideas into compelling visual stories with our comprehensive graphic design services that capture attention and convey messages effectively.',
      icon: '🖌',
      features: [
        'Logo Design & Branding',
        'Print & Digital Materials',
        'Packaging Design',
        'Social Media Graphics',
        'Infographics & Data Viz',
        'Typography & Layout'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Digital Marketing',
      description: 'Drive growth and engagement through strategic digital marketing campaigns that reach your target audience and deliver measurable results.',
      icon: '🌐',
      features: [
        'Social Media Management',
        'Content Marketing',
        'SEO & SEM',
        'Email Campaigns',
        'Analytics & Reporting',
        'Influencer Partnerships'
      ],
      image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Website & App Development',
      description: 'Build cutting-edge digital experiences with responsive websites and mobile applications that engage users and drive results.',
      icon: '💻',
      features: [
        'Responsive Web Design',
        'E-commerce Solutions',
        'Mobile App Development',
        'UI/UX Design',
        'Custom CMS Development',
        'Performance Optimization'
      ],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Architectural & Interior Design',
      description: 'Transform spaces with innovative interior design and construction solutions that blend functionality with artistic expression.',
      icon: '🏛',
      features: [
        'Interior Design Planning',
        'Space Optimization',
        'Custom Furniture Design',
        'Renovation & Construction',
        'Material Selection',
        'Project Management'
      ],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    },
    {
      id: 7,
      title: 'School Outreach & Educational Programs',
      description: 'Empower the next generation through creative educational programs and school outreach initiatives that inspire learning and artistic expression.',
      icon: '🎓',
      features: [
        'Art Education Programs',
        'School Workshops',
        'Competition Organization',
        'Student Mentorship',
        'Curriculum Development',
        'Community Engagement'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 font-['Montserrat']">
            Our <span className="text-[#D4AF37]">Services</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto">
            Comprehensive creative solutions that transform your vision into reality across Ethiopia
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 text-4xl">{service.icon}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-3 font-['Montserrat']">{service.title}</h3>
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-6 w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              How we bring your creative vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Discovery</h3>
              <p className="text-gray-700">We start by understanding your vision, goals, and requirements to create a tailored approach.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Concept</h3>
              <p className="text-gray-700">Our creative team develops concepts and designs that align with your brand and objectives.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Execution</h3>
              <p className="text-gray-700">We bring your vision to life with meticulous attention to detail and quality craftsmanship.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">4</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Delivery</h3>
              <p className="text-gray-700">We ensure smooth delivery and provide ongoing support to maintain your creative success.</p>
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
            Let's discuss how we can help bring your creative vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors shadow-lg text-lg">
              Get a Quote
            </button>
            <button className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors text-lg">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services 