import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaGithub,
  FaBehance,
  FaPinterest,
} from "react-icons/fa";
import HeaderSection from "../components/test";

const Team = () => {
  const [activeFilter, setActiveFilter] = useState("All Departments");
  const [visibleMembers, setVisibleMembers] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  // Departments
  const departments = [
    "All Departments",
    "Event Organizing",
    "Design and Marketing",
    "Art",
    "Construction",
    "IT",
  ];

  // Team data
  const teamMembers = [
    // Event Organizing Department
    {
      id: 1,
      name: "Emily Rodriguez",
      title: "Event Director",
      bio: "Experienced event planner specializing in creative event concepts and flawless execution.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      department: "Event Organizing",
      experience: "10+ Years",
      isLeader: true,
      social: { linkedin: "#", twitter: "#", instagram: "#" },
    },
    {
      id: 2,
      name: "Marcus Johnson",
      title: "Senior Event Coordinator",
      bio: "Specializes in corporate events and large-scale productions with meticulous attention to detail.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      department: "Event Organizing",
      experience: "8+ Years",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 3,
      name: "Sophia Williams",
      title: "Venue Manager",
      bio: "Expert in venue selection, logistics, and vendor coordination for events of all sizes.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      department: "Event Organizing",
      experience: "7+ Years",
      social: { linkedin: "#", instagram: "#" },
    },
    {
      id: 4,
      name: "Daniel Lee",
      title: "Event Production Specialist",
      bio: "Technical production expert with background in audio-visual coordination and stage design.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      department: "Event Organizing",
      experience: "6+ Years",
      social: { linkedin: "#", portfolio: "#" },
    },
    {
      id: 5,
      name: "Olivia Martinez",
      title: "Client Relations Manager",
      bio: "Builds and maintains client relationships, ensuring their vision is realized in every event.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      department: "Event Organizing",
      experience: "9+ Years",
      social: { linkedin: "#", twitter: "#" },
    },

    // Design and Marketing Department
    {
      id: 6,
      name: "Sarah Johnson",
      title: "Creative Director & Founder",
      bio: "Visionary leader with 15+ years of experience in creative direction and brand strategy.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      department: "Design and Marketing",
      experience: "15+ Years",
      isLeader: true,
      social: { linkedin: "#", twitter: "#", instagram: "#", portfolio: "#" },
    },
    {
      id: 7,
      name: "Alex Martinez",
      title: "Marketing Manager",
      bio: "Strategic marketing professional with expertise in digital campaigns and brand development.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      department: "Design and Marketing",
      experience: "9+ Years",
      social: { linkedin: "#", twitter: "#", instagram: "#" },
    },
    {
      id: 8,
      name: "Rachel Green",
      title: "Senior Designer",
      bio: "Versatile designer specializing in brand identity and visual communication.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      department: "Design and Marketing",
      experience: "7+ Years",
      social: { linkedin: "#", behance: "#", instagram: "#" },
    },
    {
      id: 9,
      name: "Thomas Wright",
      title: "Digital Marketing Specialist",
      bio: "Expert in SEO, SEM, and social media marketing strategies that drive engagement.",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
      department: "Design and Marketing",
      experience: "5+ Years",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 10,
      name: "Jessica Kim",
      title: "Content Strategist",
      bio: "Creates compelling content strategies that resonate with target audiences and drive conversions.",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      department: "Design and Marketing",
      experience: "6+ Years",
      social: { linkedin: "#", twitter: "#", portfolio: "#" },
    },

    // Art Department
    {
      id: 11,
      name: "Michael Chen",
      title: "Art Director",
      bio: "Passionate artist and curator with expertise in contemporary art and exhibition design.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      department: "Art",
      experience: "12+ Years",
      isLeader: true,
      social: { linkedin: "#", twitter: "#", instagram: "#" },
    },
    {
      id: 12,
      name: "Elena Rodriguez",
      title: "Senior Artist",
      bio: "Specializes in mixed media and large-scale installations for corporate and public spaces.",
      image:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face",
      department: "Art",
      experience: "10+ Years",
      social: { linkedin: "#", instagram: "#", portfolio: "#" },
    },
    {
      id: 13,
      name: "Carlos Mendez",
      title: "Visual Designer",
      bio: "Creates compelling visual narratives through illustration, typography, and digital media.",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      department: "Art",
      experience: "8+ Years",
      social: { linkedin: "#", behance: "#" },
    },
    {
      id: 14,
      name: "Nina Patel",
      title: "Art Restoration Specialist",
      bio: "Expert in preserving and restoring artworks with traditional and modern techniques.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      department: "Art",
      experience: "9+ Years",
      social: { linkedin: "#", portfolio: "#" },
    },

    // Construction Department
    {
      id: 15,
      name: "Lisa Thompson",
      title: "Interior Designer",
      bio: "Creative interior designer with a passion for sustainable design and innovative space solutions.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
      department: "Construction",
      experience: "11+ Years",
      isLeader: true,
      social: { linkedin: "#", instagram: "#", pinterest: "#" },
    },
    {
      id: 16,
      name: "James Wilson",
      title: "Project Manager",
      bio: "Experienced project manager ensuring smooth delivery of complex creative projects.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
      department: "Construction",
      experience: "13+ Years",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      id: 17,
      name: "Robert Kim",
      title: "Structural Engineer",
      bio: "Specializes in creating structurally sound yet aesthetically pleasing installations.",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      department: "Construction",
      experience: "10+ Years",
      social: { linkedin: "#", portfolio: "#" },
    },
    {
      id: 18,
      name: "Amanda Lewis",
      title: "Site Supervisor",
      bio: "Oversees on-site operations ensuring safety, quality, and timely completion of projects.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
      department: "Construction",
      experience: "8+ Years",
      social: { linkedin: "#" },
    },

    // IT Department
    {
      id: 19,
      name: "David Kim",
      title: "Lead Developer",
      bio: "Full-stack developer with expertise in modern web technologies and innovative digital solutions.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      department: "IT",
      experience: "8+ Years",
      isLeader: true,
      social: { linkedin: "#", github: "#", twitter: "#" },
    },
    {
      id: 20,
      name: "Priya Sharma",
      title: "UX/UI Designer",
      bio: "Creates intuitive user experiences and visually appealing interfaces for digital products.",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face",
      department: "IT",
      experience: "6+ Years",
      social: { linkedin: "#", behance: "#", dribbble: "#" },
    },
    {
      id: 21,
      name: "Brian Taylor",
      title: "Systems Administrator",
      bio: "Manages IT infrastructure and ensures seamless operation of all technical systems.",
      image:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face",
      department: "IT",
      experience: "7+ Years",
      social: { linkedin: "#", github: "#" },
    },
    {
      id: 22,
      name: "Michelle Wong",
      title: "Data Analyst",
      bio: "Transforms complex data into actionable insights to drive business decisions.",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face",
      department: "IT",
      experience: "5+ Years",
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  // Filter members based on active filter
  const filteredMembers =
    activeFilter === "All Departments"
      ? teamMembers
      : teamMembers.filter((member) => member.department === activeFilter);

  // Calculate department counts
  const departmentCounts = departments.reduce((acc, dept) => {
    if (dept === "All Departments") {
      acc[dept] = teamMembers.length;
    } else {
      acc[dept] = teamMembers.filter((m) => m.department === dept).length;
    }
    return acc;
  }, {});

  // Load more members
  const loadMore = () => {
    setVisibleMembers((prev) => prev + 8);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Render social icon based on platform
  const renderSocialIcon = (platform, url) => {
    const iconProps = { className: "w-4 h-4" };

    switch (platform) {
      case "linkedin":
        return <FaLinkedin {...iconProps} />;
      case "twitter":
        return <FaTwitter {...iconProps} />;
      case "instagram":
        return <FaInstagram {...iconProps} />;
      case "github":
        return <FaGithub {...iconProps} />;
      case "behance":
        return <FaBehance {...iconProps} />;
      case "pinterest":
        return <FaPinterest {...iconProps} />;
      case "portfolio":
        return <FaEnvelope {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#010120] to-[#111130] text-white font-sans overflow-hidden">
      {/* Header Section */}
      <HeaderSection />
      <section className="relative py-20 bg-gradient-to-br from-[#111130] to-[#212140] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute top-0 right-0 -mr-40 mt-10 opacity-10">
          <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M200 0C89.543 0 0 89.543 0 200C0 310.457 89.543 400 200 400C310.457 400 400 310.457 400 200C400 89.543 310.457 0 200 0Z"
              fill="#D4AF37"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {departments.map((dept) => (
              <motion.button
                key={dept}
                onClick={() => {
                  setActiveFilter(dept);
                  setVisibleMembers(8);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === dept
                    ? "bg-[#D4AF37] text-black shadow-lg"
                    : "bg-white bg-opacity-10 text-white hover:bg-opacity-20 backdrop-blur-sm"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {dept} ({departmentCounts[dept]})
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-black mb-16 font-montserrat"
          >
            {activeFilter} <span className="text-[#D4AF37]">Team</span>
          </motion.h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl h-96 animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                <AnimatePresence>
                  {filteredMembers.slice(0, visibleMembers).map((member) => (
                    <motion.div
                      key={member.id}
                      variants={itemVariants}
                      layout
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-xs font-semibold">
                          {member.experience}
                        </div>
                        {member.isLeader && (
                          <div className="absolute top-4 right-4 bg-black text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold">
                            Team Lead
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <h3 className="text-white font-semibold text-lg">
                            {member.name}
                          </h3>
                          <p className="text-[#D4AF37] text-sm">
                            {member.title}
                          </p>
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                          {member.bio}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {member.department}
                          </span>
                        </div>

                        <div className="flex space-x-3">
                          {Object.entries(member.social).map(
                            ([platform, url]) => (
                              <motion.a
                                key={platform}
                                href={url}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#D4AF37] hover:text-white transition-colors"
                                whileHover={{ y: -3 }}
                                aria-label={`${member.name}'s ${platform}`}
                              >
                                {renderSocialIcon(platform, url)}
                              </motion.a>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {visibleMembers < filteredMembers.length && (
                <motion.div
                  className="text-center mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    onClick={loadMore}
                    className="px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-full relative overflow-hidden group"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span className="relative z-10">
                      Load More Team Members
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#B8941F] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                {teamMembers.length}+
              </div>
              <div className="text-gray-400">Team Members</div>
            </motion.div>

            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                {departments.length - 1}
              </div>
              <div className="text-gray-400">Departments</div>
            </motion.div>

            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                150+
              </div>
              <div className="text-gray-400">Projects Completed</div>
            </motion.div>

            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                12
              </div>
              <div className="text-gray-400">Years Experience</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-6 font-montserrat"
          >
            Join Our <span className="text-[#D4AF37]">Creative Team</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            We're always looking for talented individuals who share our passion
            for creativity and innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              className="px-8 py-4 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#B8941F] transition-colors shadow-lg"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              View Open Positions
            </motion.button>

            <motion.button
              className="px-8 py-4 border-2 border-[#D4AF37] text-[#D4AF37] font-semibold rounded-lg hover:bg-[#D4AF37] hover:text-black transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Send Your Resume
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;
