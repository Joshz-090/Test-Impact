import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [departments, setDepartments] = useState(["All Departments"]);

  // Load members from Firestore and derive departments
  useEffect(() => {
    const q = query(collection(db, "members"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          const social = {
            linkedin: d?.contacts?.linkedin || "",
            twitter: d?.contacts?.twitter || "",
            instagram: d?.contacts?.instagram || "",
            github: d?.contacts?.github || "",
            behance: d?.contacts?.behance || "",
            pinterest: d?.contacts?.pinterest || "",
            portfolio: d?.contacts?.website || d?.contacts?.email || "",
          };
          Object.keys(social).forEach((k) => {
            if (!social[k]) delete social[k];
          });

          return {
            id: doc.id,
            name: d?.name || "",
            title: d?.role || "",
            bio: d?.description || "",
            image: d?.photoURL || "",
            department: d?.department || "",
            experience: d?.experience || "",
            isLeader: !!d?.isLeader,
            social,
          };
        });

        setTeamMembers(data);
        const uniqueDepts = Array.from(
          new Set(data.map((m) => m.department).filter(Boolean))
        );
        setDepartments(["All Departments", ...uniqueDepts]);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading members:", error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

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

  // Enhanced Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: { scale: 0.95, y: 0 },
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Render social icon based on platform
  const renderSocialIcon = (platform) => {
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

      {/* Team Grid Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle geometric patterns */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/8 to-transparent rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-[#D4AF37]/3 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-gradient-to-br from-[#D4AF37]/6 to-transparent rounded-full blur-lg"></div>

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/10 px-4 py-2 rounded-full">
                Our Amazing Team
              </span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-montserrat"
            >
              Meet Our{" "}
              <span className="text-[#D4AF37] relative">
                {activeFilter} Team
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-full"></div>
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Discover the talented individuals who bring creativity, expertise,
              and passion to every project we undertake.
            </motion.p>
          </motion.div>

          <section className="relative py-20 text-black overflow-hidden">
            <div className="absolute inset-0"></div>
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

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-black">
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
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all text-black ${
                      activeFilter === dept
                        ? "bg-[#D4AF37] text-black shadow-lg"
                        : "bg-white bg-opacity-10 text-black hover:bg-opacity-20 backdrop-blur-sm"
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-[500px] animate-pulse shadow-lg"
                ></div>
              ))}
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                <AnimatePresence>
                  {filteredMembers.slice(0, visibleMembers).map((member) => (
                    <motion.div
                      key={member.id}
                      variants={itemVariants}
                      layout
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#D4AF37]/20 hover:-translate-y-2"
                    >
                      {/* Enhanced Image Container */}
                      <div className="relative overflow-hidden h-72">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Enhanced Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Enhanced Badges */}
                        {member.experience && (
                          <motion.div
                            className="absolute top-4 left-4 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            {member.experience}
                          </motion.div>
                        )}
                        {member.isLeader && (
                          <motion.div
                            className="absolute top-4 right-4 bg-gradient-to-r from-gray-900 to-black text-[#D4AF37] px-4 py-2 rounded-full text-xs font-bold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            👑 Team Lead
                          </motion.div>
                        )}

                        {/* Enhanced Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <motion.h3
                            className="text-white font-bold text-xl mb-1"
                            whileHover={{ x: 5 }}
                          >
                            {member.name}
                          </motion.h3>
                          <p className="text-[#D4AF37] text-sm font-medium">
                            {member.title}
                          </p>
                        </div>

                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Enhanced Content Section */}
                      <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>

                        {/* Enhanced Department Badge */}
                        <div className="flex items-center justify-between mb-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 uppercase tracking-wide">
                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-2"></div>
                            {member.department}
                          </span>
                        </div>

                        {/* Enhanced Social Media Section */}
                        <div className="flex space-x-3">
                          {(() => {
                            const prioritizedPlatforms = [
                              "linkedin",
                              "twitter",
                              "instagram",
                              "portfolio",
                            ];

                            const availablePlatforms = Object.keys(
                              member.social
                            );
                            const displayPlatforms = prioritizedPlatforms
                              .filter((platform) =>
                                availablePlatforms.includes(platform)
                              )
                              .slice(0, 4);

                            if (displayPlatforms.length < 4) {
                              const remainingPlatforms = availablePlatforms
                                .filter(
                                  (platform) =>
                                    !displayPlatforms.includes(platform)
                                )
                                .slice(0, 4 - displayPlatforms.length);
                              displayPlatforms.push(...remainingPlatforms);
                            }

                            return displayPlatforms.map((platform) => (
                              <motion.a
                                key={platform}
                                href={member.social[platform]}
                                className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 hover:from-[#D4AF37] hover:to-[#B8941F] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
                                whileHover={{ y: -3, scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={`${member.name}'s ${platform}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {renderSocialIcon(platform)}
                              </motion.a>
                            ));
                          })()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Enhanced Load More Button */}
              {visibleMembers < filteredMembers.length && (
                <motion.div
                  className="text-center mt-20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    onClick={loadMore}
                    className="relative px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-black font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <span className="relative z-10 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Load More Team Members
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#B8941F] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
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
