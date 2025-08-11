import React, { useState, useEffect } from "react";
import { FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import ErrorBoundary from "../../components/ErrorBoundary";
import img from "../../assets/images/content.jpg";

const HomeComp6 = () => {
  const [visibleMembers, setVisibleMembers] = useState(4);
  const [showAllMessage, setShowAllMessage] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortedMembers, setSortedMembers] = useState([]);

  // Team data with image paths and social links
  const teamMembers = [
    {
      id: 1,
      name: "Sosina Eshetu",
      position: "CEO & Founder",
      description:
        "Event Organizer and Artist with over 10 years of experience in creative direction and community engagement.",
      image: img,
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sosina@impact.com",
      },
      department: "executive",
      isCEO: true,
    },
    {
      id: 2,
      name: "Kalkidan Nega",
      position: "Managing Director",
      description:
        "Architect and Digital Marketing specialist with expertise in combining design thinking with strategic marketing.",
      image: img,
      social: {
        linkedin: "#",
        instagram: "#",
        email: "kalkidan@impact.com",
      },
      department: "executive",
    },
    {
      id: 3,
      name: "Yonas Tekle",
      position: "Lead Designer",
      description:
        "Creative designer with a background in visual arts and a passion for creating impactful brand identities.",
      image: img,
      social: {
        linkedin: "#",
        instagram: "#",
        email: "yonas@impact.com",
      },
      department: "design",
    },
    {
      id: 4,
      name: "Meron Abebe",
      position: "Creative Director",
      description:
        "Visual storyteller with expertise in photography and film production.",
      image: img,
      social: {
        linkedin: "#",
        instagram: "#",
        email: "meron@impact.com",
      },
      department: "creative",
    },
    {
      id: 5,
      name: "Daniel Mekonnen",
      position: "Technical Lead",
      description:
        "Software engineer specializing in interactive installations and web development.",
      image: img,
      social: {
        linkedin: "#",
        email: "daniel@impact.com",
      },
      department: "technology",
    },
    {
      id: 6,
      name: "Selamawit Assefa",
      position: "Marketing Manager",
      description:
        "Digital marketing expert with a focus on social media strategy.",
      image: img,
      social: {
        linkedin: "#",
        instagram: "#",
        email: "selamawit@impact.com",
      },
      department: "marketing",
    },
    {
      id: 7,
      name: "Ephrem Tadesse",
      position: "Event Coordinator",
      description:
        "Logistics specialist with experience in large-scale event planning.",
      image: img,
      social: {
        linkedin: "#",
        email: "ephrem@impact.com",
      },
      department: "operations",
    },
    {
      id: 8,
      name: "Hanna Girma",
      position: "Graphic Designer",
      description:
        "Brand identity specialist with a minimalist design approach.",
      image: img,
      social: {
        linkedin: "#",
        behance: "#",
        email: "hanna@impact.com",
      },
      department: "design",
    },
    {
      id: 9,
      name: "Tewodros Kebede",
      position: "Content Producer",
      description:
        "Writer and content strategist with a background in journalism.",
      image: img,
      social: {
        linkedin: "#",
        twitter: "#",
        email: "tewodros@impact.com",
      },
      department: "content",
    },
    {
      id: 10,
      name: "Alemitu Fikre",
      position: "Community Manager",
      description:
        "Engagement specialist focused on building creative communities.",
      image: img,
      social: {
        linkedin: "#",
        twitter: "#",
        email: "alemitu@impact.com",
      },
      department: "community",
    },
    {
      id: 11,
      name: "Tewodros Kebede",
      position: "Content Producer",
      description:
        "Writer and content strategist with a background in journalism.",
      image: img,
      social: {
        linkedin: "#",
        twitter: "#",
        email: "tewodros@impact.com",
      },
      department: "content",
    },
    {
      id: 12,
      name: "Alemitu Fikre",
      position: "Community Manager",
      description:
        "Engagement specialist focused on building creative communities.",
      image: img,
      social: {
        linkedin: "#",
        twitter: "#",
        email: "alemitu@impact.com",
      },
      department: "community",
    },
  ];

  // Filter and sort members
  useEffect(() => {
    let filtered = [...teamMembers];

    if (filter !== "all") {
      filtered = filtered.filter((member) =>
        filter === "executive" ? member.isCEO : member.department === filter
      );
    }

    setSortedMembers(filtered);
    setVisibleMembers(filtered.length > 4 ? 4 : filtered.length);
    setShowAllMessage(false);
  }, [filter]);

  const loadMoreMembers = () => {
    if (visibleMembers >= sortedMembers.length) {
      setShowAllMessage(true);
      setTimeout(() => setShowAllMessage(false), 3000);
      return;
    }
    setVisibleMembers((prev) => Math.min(prev + 3, sortedMembers.length));
  };

  const displayedMembers = sortedMembers.slice(0, visibleMembers);
  const nonCEOMembers = displayedMembers.filter((member) => !member.isCEO);
  const ceoMember = displayedMembers.find((member) => member.isCEO);

  return (
    <ErrorBoundary>
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold sm:text-4xl uppercase tracking-wider font-montserrat"
              style={{ color: "#d4af37" }} // Gold color
            >
              Our Team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Meet the creative minds behind Impact Production who bring
              passion, expertise, and innovation to every project.
            </motion.p>
          </div>

          {/* Filter Controls */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-md shadow-sm flex-wrap justify-center">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  filter === "all"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Team
              </button>
              <button
                onClick={() => setFilter("executive")}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === "executive"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Leadership
              </button>
              <button
                onClick={() => setFilter("design")}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === "design"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Design
              </button>
              <button
                onClick={() => setFilter("creative")}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === "creative"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Creative
              </button>
              <button
                onClick={() => setFilter("technology")}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === "technology"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Technology
              </button>
              <button
                onClick={() => setFilter("marketing")}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === "marketing"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Marketing
              </button>
              <button
                onClick={() => setFilter("operations")}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === "operations"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Operations
              </button>
              <button
                onClick={() => setFilter("content")}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === "content"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setFilter("community")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  filter === "community"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Community
              </button>
            </div>
          </div>

          {/* CEO Card */}
          <AnimatePresence>
            {ceoMember && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="col-span-full flex justify-center mb-16"
              >
                <div className="bg-gradient-to-r from-yellow-50 to-gray-50 rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl transform transition-all hover:shadow-lg border-2 border-yellow-200">
                  <div className="md:flex">
                    <div className="md:w-1/3 p-6 flex justify-center">
                      <div className="relative h-64 w-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={ceoMember.image}
                          alt={ceoMember.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = "/team/placeholder.jpg";
                          }}
                        />
                      </div>
                    </div>

                    <div className="md:w-2/3 p-8 flex flex-col justify-center">
                      <div>
                        <span className="inline-block px-3 py-1 bg-yellow-500 text-white text-xs font-semibold tracking-wider rounded-full mb-4">
                          LEADERSHIP
                        </span>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {ceoMember.name}
                        </h3>
                        <p className="text-yellow-600 text-xl font-semibold mb-6">
                          {ceoMember.position}
                        </p>
                        <p className="text-gray-600 mb-6">
                          {ceoMember.description}
                        </p>
                        <div className="flex space-x-4">
                          {ceoMember.social.linkedin && (
                            <a
                              href={ceoMember.social.linkedin}
                              className="text-gray-500 hover:text-yellow-500"
                            >
                              <FaLinkedin className="w-5 h-5" />
                            </a>
                          )}
                          {ceoMember.social.twitter && (
                            <a
                              href={ceoMember.social.twitter}
                              className="text-gray-500 hover:text-yellow-500"
                            >
                              <FaTwitter className="w-5 h-5" />
                            </a>
                          )}
                          {ceoMember.social.email && (
                            <a
                              href={`mailto:${ceoMember.social.email}`}
                              className="text-gray-500 hover:text-yellow-500"
                            >
                              <FaEnvelope className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {nonCEOMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col">
                    <div className="relative pt-8 px-8 flex justify-center">
                      <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = "/team/placeholder.jpg";
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                        {member.name}
                      </h3>
                      <p className="text-yellow-600 font-semibold text-center mb-4">
                        {member.position}
                      </p>
                      <p className="text-gray-600 text-center mb-6 flex-grow">
                        {member.description}
                      </p>
                      <div className="flex justify-center space-x-4">
                        {member.social && member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            className="text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            <FaLinkedin className="w-5 h-5" />
                          </a>
                        )}
                        {member.social && member.social.twitter && (
                          <a
                            href={member.social.twitter}
                            className="text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            <FaTwitter className="w-5 h-5" />
                          </a>
                        )}
                        {member.social && member.social.instagram && (
                          <a
                            href={member.social.instagram}
                            className="text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            <FaInstagram className="w-5 h-5" />
                          </a>
                        )}
                        {member.social && member.social.email && (
                          <a
                            href={`mailto:${member.social.email}`}
                            className="text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            <FaEnvelope className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            {visibleMembers < sortedMembers.length ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMoreMembers}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-md transition-all duration-300"
              >
                Load More Team Members
              </motion.button>
            ) : (
              sortedMembers.length > 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showAllMessage ? 1 : 0 }}
                  className="text-gray-500 italic"
                >
                  No more team members to display.
                </motion.div>
              )
            )}
          </div>
        </div>
        <div className="line-section">
          <div className="gradient-divider"></div>{" "}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default HomeComp6;
