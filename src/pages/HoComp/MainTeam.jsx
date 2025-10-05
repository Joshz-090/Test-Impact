import React, { useState, useEffect } from "react";
import { FaLinkedin, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import ErrorBoundary from "../../components/ErrorBoundary";
import img from "../../assets/images/R/images.png";
import sosina from "../../assets/images/members/Sosina.png";
import kalkidan from "../../assets/images/members/kalkidan.png";
import Lijeshet from "../../assets/images/members/Lijeshet.png";
import Fitsum from "../../assets/images/members/Fitsum.png";
import yohanes from "../../assets/images/members/yohanes.png";
import tsehay from "../../assets/images/members/tsehay.png";
import Mikias from "../../assets/images/members/Mikias.png";
import Nahome from "../../assets/images/members/nahome.png";

const MainTeam = () => {
  const [visibleMembers, setVisibleMembers] = useState(6);
  const [showAllMessage, setShowAllMessage] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortedMembers, setSortedMembers] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  const teamMembers = [
    {
      id: 1,
      name: "Sosina Eshetu",
      position: "CEO & Founder",
      description:
        "Event Organizer and Artist with over 10 years of experience. A young female leader dynamic and accomplished individual with a diverse skill set spanning event organization, team leadership, and creative entrepreneurship.",
      image: sosina, // Use the imported sosina image
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sosina@impact.com",
      },
      department: "executive",
      isExecutive: true,
    },
    {
      id: 2,
      name: "Kalkidan Nega",
      position: "Managing Director",
      description:
        "Architect and versatile professional excelling in digital marketing, graphic design, content creation, architectural design, and interior design.",
      image: kalkidan, // Use the imported kalkidan image
      social: {
        linkedin: "#",
        instagram: "#",
        email: "kalkidan@impact.com",
      },
      department: "executive",
      isExecutive: true,
    },
    {
      id: 3,
      name: "Mikias Tadese",
      position: "Construction Department Manager",
      description:
        "Architect with a strong background in architecture and construction management. A talented individual with extensive experience in construction projects.",
      image: Mikias, // Use the imported Mikias image
      social: {
        linkedin: "#",
        email: "mikias@impact.com",
      },
      department: "construction",
      isPriority: true,
    },
    {
      id: 4,
      name: "Fitsum Bereket",
      position: "Event Organizer Department Manager",
      description:
        "Skilled designer and event management professional with talent for organizing events and managing teams effectively.",
      image: Fitsum, // You'll need to import Fitsum's image
      social: {
        linkedin: "#",
        instagram: "#",
        email: "fitsum@impact.com",
      },
      department: "events",
    },
    {
      id: 5,
      name: "Lijeshet Abebe",
      position: "Art Department Manager",
      description:
        "Hyper-realistic artist specializing in custom graphite drawings, with additional expertise in social media management.",
      image: Lijeshet, // Use the imported Lijeshet image
      social: {
        linkedin: "#",
        instagram: "#",
        email: "lijeshet@impact.com",
      },
      department: "art",
      isPriority: true,
    },
    {
      id: 6,
      name: "Yohanes Ayalew",
      position: "Design and Marketing Department Manager",
      description:
        "Talented designer who excels at managing multiple projects effectively with strong organizational skills and marketing expertise.",
      image: yohanes, // Use the imported yohanes image
      social: {
        linkedin: "#",
        twitter: "#",
        email: "yohanes@impact.com",
      },
      department: "design",
    },
    // Keep the rest of your team members or remove them if not needed
    {
      id: 7,
      name: "Tsehay Asefa",
      position: "Teaching and Fine Art Division Head",
      description:
        "Talented fine art artist who has successfully translated her passion into a thriving business, participating in numerous art exhibitions.",
      image: tsehay, // Use the imported tsehay image
      social: {
        linkedin: "#",
        instagram: "#",
        email: "tsehay@impact.com",
      },
      department: "art",
    },
    {
      id: 8,
      name: "Nahom Getnet",
      position: "IT Department Manager",
      description:
        "Web development specialist with a computer science background, combining technical expertise with creative solutions.",
      image: Nahome,
      social: {
        linkedin: "#",
        email: "nahom@impact.com",
      },
      department: "technology",
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
  ];

  useEffect(() => {
    let filtered = [...teamMembers];
    if (filter !== "all") {
      filtered = filtered.filter((member) =>
        filter === "executive"
          ? member.isExecutive
          : member.department === filter
      );
    }
    filtered.sort((a, b) => {
      if (a.isExecutive && !b.isExecutive) return -1;
      if (!a.isExecutive && b.isExecutive) return 1;
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return 0;
    });
    setSortedMembers(filtered);
    setVisibleMembers(6);
    setShowAllMessage(false);
  }, [filter]);

  const loadMoreMembers = () => {
    if (visibleMembers >= sortedMembers.length) {
      setShowAllMessage(true);
      setTimeout(() => setShowAllMessage(false), 2000);
      return;
    }
    setVisibleMembers((prev) => prev + 4);
  };

  const displayedMembers = sortedMembers.slice(0, visibleMembers);
  const executiveMembers = displayedMembers.filter(
    (member) => member.isExecutive
  );
  const nonExecutiveMembers = displayedMembers.filter(
    (member) => !member.isExecutive
  );

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    initial: { scale: 1, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)" },
    hover: {
      scale: 1.05,
      boxShadow: "0px 6px 16px rgba(212, 175, 55, 0.4)",
      background: [
        "linear-gradient(45deg, #D4AF37, #F1C84C)",
        "linear-gradient(45deg, #F1C84C, #D4AF37)",
      ],
      transition: {
        scale: { duration: 0.3 },
        boxShadow: { duration: 0.3 },
        background: { duration: 1, repeat: Infinity, repeatType: "reverse" },
      },
    },
    tap: { scale: 0.95 },
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ErrorBoundary>
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold uppercase tracking-wider font-montserrat text-black"
            >
              Our <span className="text-[#D4AF37]">Team</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Meet the creative minds behind Impact Production who drive
              passion, expertise, and innovation.
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              "all",
              "design",
              "creative",
              "technology",
              "marketing",
              "operations",
              "content",
              "community",
            ].map((dept) => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filter === dept
                    ? "bg-[#D4AF37] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors focus:outline-none focus:ring-2 focus:ring-[#F1C84C]`}
                aria-label={`Filter by ${dept} department`}
              >
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {executiveMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
              >
                {executiveMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white rounded-xl shadow-lg border border-[#D4AF37]/30 overflow-hidden hover:shadow-xl transition-all"
                    role="article"
                    aria-labelledby={`executive-${member.id}`}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 p-4 flex justify-center">
                        <div className="relative h-44 w-44 rounded-full overflow-hidden border-3 border-[#D4AF37]/20 shadow-md">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) =>
                              (e.target.src = "/team/placeholder.jpg")
                            }
                          />
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6 flex flex-col justify-center relative">
                        {/* Premium badge with subtle animation */}
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-block px-3 py-1.5 bg-gradient-to-r from-[#8E6C29] to-[#D4AF37] text-white text-xs font-bold tracking-wider rounded-full mb-3 shadow-lg self-start"
                        >
                          EXECUTIVE LEADERSHIP
                        </motion.span>

                        {/* Name with elegant underline effect */}
                        <div className="relative mb-2">
                          <h3
                            className="text-2xl font-bold text-gray-900 mb-1 font-montserrat"
                            id={`executive-${member.id}`}
                          >
                            {member.name}
                          </h3>
                          <div className="h-1 w-12 bg-[#D4AF37] rounded-full"></div>
                        </div>

                        {/* Position with golden text and subtle shadow */}
                        <p className="text-[#D4AF37] text-lg font-semibold mb-4 tracking-wide relative">
                          {member.position}
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></span>
                        </p>

                        {/* Description with improved typography */}
                        <p className="text-gray-700 text-sm mb-3 leading-relaxed border-l-3 border-[#D4AF37] pl-4 italic">
                          {expandedCards[member.id]
                            ? member.description
                            : `${member.description.substring(0, 100)}...`}
                          {member.description.length > 100 && (
                            <button
                              onClick={() => toggleExpand(member.id)}
                              className="text-[#D4AF37] font-semibold ml-1 hover:text-[#8E6C29] transition-colors focus:outline-none"
                            >
                              {expandedCards[member.id]
                                ? "Read Less"
                                : "Read More"}
                            </button>
                          )}
                        </p>

                        {/* Social links with enhanced styling */}
                        <div className="flex space-x-4">
                          {member.social.linkedin && (
                            <motion.a
                              whileHover={{ y: -3 }}
                              href={member.social.linkedin}
                              className="bg-gray-100 p-2 rounded-full text-gray-700 hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-sm"
                              aria-label={`LinkedIn profile of ${member.name}`}
                            >
                              <FaLinkedin className="w-4 h-4" />
                            </motion.a>
                          )}
                          {member.social.twitter && (
                            <motion.a
                              whileHover={{ y: -3 }}
                              href={member.social.twitter}
                              className="bg-gray-100 p-2 rounded-full text-gray-700 hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-sm"
                              aria-label={`Twitter profile of ${member.name}`}
                            >
                              <FaTwitter className="w-4 h-4" />
                            </motion.a>
                          )}
                          {member.social.instagram && (
                            <motion.a
                              whileHover={{ y: -3 }}
                              href={member.social.instagram}
                              className="bg-gray-100 p-2 rounded-full text-gray-700 hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-sm"
                              aria-label={`Instagram profile of ${member.name}`}
                            >
                              <FaInstagram className="w-4 h-4" />
                            </motion.a>
                          )}
                          {member.social.email && (
                            <motion.a
                              whileHover={{ y: -3 }}
                              href={`mailto:${member.social.email}`}
                              className="bg-gray-100 p-2 rounded-full text-gray-700 hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-sm"
                              aria-label={`Email ${member.name}`}
                            >
                              <FaEnvelope className="w-4 h-4" />
                            </motion.a>
                          )}
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                          <svg viewBox="0 0 100 100" className="text-[#D4AF37]">
                            <path
                              d="M50 0 L100 50 L50 100 L0 50 Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {nonExecutiveMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {nonExecutiveMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
                    role="article"
                    aria-labelledby={`member-${member.id}`}
                  >
                    <div className="pt-5 px-5 flex justify-center">
                      <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) =>
                            (e.target.src = "/team/placeholder.jpg")
                          }
                        />
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h3
                        className="text-lg font-bold text-gray-900 mb-1 font-montserrat"
                        id={`member-${member.id}`}
                      >
                        {member.name}
                      </h3>
                      <p className="text-[#D4AF37] text-sm font-semibold mb-2">
                        {member.position}
                      </p>
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed border-l-3 border-[#D4AF37] pl-4 italic">
                        {expandedCards[member.id]
                          ? member.description
                          : `${member.description.substring(0, 100)}...`}
                        {member.description.length > 100 && (
                          <button
                            onClick={() => toggleExpand(member.id)}
                            className="text-gray-900 font-semibold ml-1 hover:text-[#9E7C39] transition-colors focus:outline-none"
                          >
                            {expandedCards[member.id]
                              ? "Read Less"
                              : "Read More"}
                          </button>
                        )}
                      </p>
                      <div className="flex justify-center space-x-2">
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            className="text-gray-400 hover:text-[#D4AF37]"
                            aria-label={`LinkedIn profile of ${member.name}`}
                          >
                            <FaLinkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.social.twitter && (
                          <a
                            href={member.social.twitter}
                            className="text-gray-400 hover:text-[#D4AF37]"
                            aria-label={`Twitter profile of ${member.name}`}
                          >
                            <FaTwitter className="w-4 h-4" />
                          </a>
                        )}
                        {member.social.instagram && (
                          <a
                            href={member.social.instagram}
                            className="text-gray-400 hover:text-[#D4AF37]"
                            aria-label={`Instagram profile of ${member.name}`}
                          >
                            <FaInstagram className="w-4 h-4" />
                          </a>
                        )}
                        {member.social.email && (
                          <a
                            href={`mailto:${member.social.email}`}
                            className="text-gray-400 hover:text-[#D4AF37]"
                            aria-label={`Email ${member.name}`}
                          >
                            <FaEnvelope className="w-4 h-4" />
                          </a>
                        )}
                        {member.social.behance && (
                          <a
                            href={member.social.behance}
                            className="text-gray-400 hover:text-[#D4AF37]"
                            aria-label={`Behance profile of ${member.name}`}
                          >
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.507.109 1.188.109 1.757h-5.147c.001 1.885.791 3.12 2.766 3.12 1.203 0 2.151-.541 2.658-1.508h2.438zm-2.827-3.622c-.374-1.185-1.282-2.098-2.775-2.098-1.711 0-2.618 1.093-2.618 2.719 0 1.695.951 2.601 2.633 2.601 1.432 0 2.53-1.074 2.76-2.222h-2.76zm-9.693-1.378h-3.606v-2h3.606v2zm0 3.378h-3.606v-2h3.606v2zm0 3.378h-3.606v-2h3.606v2zm-6.606-8.756c-2.297 0-4.394 1.831-4.394 5.756 0 3.926 2.297 5.756 4.394 5.756 2.096 0 4.394-1.83 4.394-5.756 0-3.925-2.098-5.756-4.394-5.756zm0 9.512c-1.695 0-2.971-1.411-2.971-3.756 0-2.347 1.276-3.756 2.971-3.756 1.694 0 2.971 1.409 2.971 3.756 0 2.345-1.277 3.756-2.971 3.756z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mt-8">
            {visibleMembers < sortedMembers.length ? (
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={loadMoreMembers}
                className="px-5 py-2 bg-[#D4AF37] text-white font-semibold rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F1C84C]"
                aria-label="Load more team members"
              >
                Load More Team Members
              </motion.button>
            ) : (
              sortedMembers.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: showAllMessage ? 1 : 0,
                    y: showAllMessage ? 0 : 10,
                  }}
                  className="text-gray-600 text-sm italic"
                  role="alert"
                >
                  All team members displayed.
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default MainTeam;
