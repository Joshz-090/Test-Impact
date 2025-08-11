// import Test from "../components/test";
import Test2 from "../components/ThreeDemo"

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Creative Director & Founder',
      bio: 'Visionary leader with 15+ years of experience in creative direction and brand strategy. Sarah leads our creative vision and ensures every project exceeds expectations.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      department: 'Design & Marketing',
      experience: '15+ Years',
      social: {
        linkedin: '#',
        twitter: '#',
        instagram: '#',
        portfolio: '#'
      }
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Art Director',
      bio: 'Passionate artist and curator with expertise in contemporary art and exhibition design. Michael brings artistic vision to every project we undertake.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      department: 'Art',
      experience: '12+ Years',
      social: {
        linkedin: '#',
        twitter: '#',
        instagram: '#',
        portfolio: '#'
      }
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Event Director',
      bio: 'Experienced event planner specializing in creative event concepts and flawless execution. Emily ensures every event is memorable and impactful.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      department: 'Event Organizing',
      experience: '10+ Years',
      social: {
        linkedin: '#',
        twitter: '#',
        instagram: '#',
        portfolio: '#'
      }
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Lead Developer',
      bio: 'Full-stack developer with expertise in modern web technologies. David creates innovative digital solutions that drive business growth.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      department: 'IT/Web',
      experience: '8+ Years',
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#',
        portfolio: '#'
      }
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'Interior Designer',
      bio: 'Creative interior designer with a passion for sustainable design and innovative space solutions. Lisa transforms spaces into inspiring environments.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      department: 'Construction',
      experience: '11+ Years',
      social: {
        linkedin: '#',
        instagram: '#',
        pinterest: '#',
        portfolio: '#'
      }
    },
    {
      id: 6,
      name: 'Alex Martinez',
      title: 'Marketing Manager',
      bio: 'Strategic marketing professional with expertise in digital campaigns and brand development. Alex drives our marketing initiatives and client growth.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      department: 'Design & Marketing',
      experience: '9+ Years',
      social: {
        linkedin: '#',
        twitter: '#',
        instagram: '#',
        portfolio: '#'
      }
    },
    {
      id: 7,
      name: 'Rachel Green',
      title: 'Senior Designer',
      bio: 'Versatile designer specializing in brand identity and visual communication. Rachel creates compelling designs that connect with audiences.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      department: 'Design & Marketing',
      experience: '7+ Years',
      social: {
        linkedin: '#',
        behance: '#',
        instagram: '#',
        portfolio: '#'
      }
    },
    {
      id: 8,
      name: 'James Wilson',
      title: 'Project Manager',
      bio: 'Experienced project manager ensuring smooth delivery of complex creative projects. James coordinates teams and maintains quality standards.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
      department: 'Construction',
      experience: '13+ Years',
      social: {
        linkedin: '#',
        twitter: '#',
        portfolio: '#'
      }
    }
  ]

  const departments = [
    { name: 'Design & Marketing', count: 3, color: 'bg-purple-100 text-purple-800' },
    { name: 'Art', count: 1, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Event Organizing', count: 1, color: 'bg-blue-100 text-blue-800' },
    { name: 'IT/Web', count: 1, color: 'bg-green-100 text-green-800' },
    { name: 'Construction', count: 2, color: 'bg-red-100 text-red-800' }
  ]

  return (

<>
    {/* <Test /> */}
    
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 font-['Montserrat']">
            Meet Our <span className="text-[#D4AF37]">Team</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto">
            Talented professionals passionate about creating exceptional art and design experiences
          </p>
        </div>
      </section>

      <Test2/>

      {/* Team Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4 font-['Montserrat']">
              Team <span className="text-[#D4AF37]">Overview</span>
            </h2>
            <p className="text-xl text-gray-600">
              Our diverse team of creative professionals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {departments.map((dept) => (
              <div key={dept.name} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${dept.color}`}>
                  {dept.name}
                </div>
                <div className="text-2xl font-bold text-[#D4AF37]">{dept.count}</div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {member.experience}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-1 font-['Montserrat']">{member.name}</h3>
                  <p className="text-[#D4AF37] font-medium mb-2">{member.title}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">{member.department}</span>
                  </div>
                  
                  {/* Social Media Icons */}
                  <div className="flex space-x-3">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.instagram && (
                      <a href={member.social.instagram} className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                        </svg>
                      </a>
                    )}
                    {member.social.portfolio && (
                      <a href={member.social.portfolio} className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.493-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.35v-2.715c0-.4-.122-.719-.368-.979-.245-.259-.587-.389-.988-.389-.416 0-.752.13-1.012.389-.26.26-.39.579-.39.979v2.715h-1.35v-6h1.35v1.119c.325-.279.69-.419 1.095-.419.416 0 .752.13 1.012.389.26.26.39.579.39.979v2.715h1.35v-6h1.35v6z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Culture */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Our <span className="text-[#D4AF37]">Culture</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What makes our team special and how we work together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Creative Freedom</h3>
              <p className="text-gray-700">We encourage innovation and creative expression, allowing each team member to bring their unique perspective to projects.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Collaboration</h3>
              <p className="text-gray-700">We believe in the power of teamwork and foster an environment where ideas flow freely and skills complement each other.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 font-['Montserrat']">Growth</h3>
              <p className="text-gray-700">Continuous learning and professional development are core to our culture, ensuring we stay at the forefront of our industry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-['Montserrat']">
            Join Our <span className="text-[#D4AF37]">Creative Team</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We're always looking for talented individuals who share our passion for creativity and innovation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors shadow-lg text-lg">
              View Open Positions
            </button>
            <button className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors text-lg">
              Send Your Resume
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default Team ;