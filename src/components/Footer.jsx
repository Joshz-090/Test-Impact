import { motion } from "framer-motion";
import { useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import HoverSection from "./HoverSection";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showMessage("Please enter a valid email address", "error");
      return;
    }

    setIsLoading(true);
    setMessage("Please wait...");
    setMessageType("");

    try {
      // Try to check if email already exists (may fail due to permissions)
      let isDuplicate = false;
      try {
        const subscribersRef = collection(db, "subscribers");
        const q = query(
          subscribersRef,
          where("email", "==", email.trim().toLowerCase()),
          limit(1)
        );
        const existingSubscribers = await getDocs(q);
        isDuplicate = !existingSubscribers.empty;
      } catch (checkError) {
        console.warn(
          "Could not check for duplicates due to permissions:",
          checkError
        );
        // Continue with subscription attempt
      }

      if (isDuplicate) {
        showMessage("This account is already subscribed", "error");
        setIsLoading(false);
        return;
      }

      // Add new subscriber
      await addDoc(collection(db, "subscribers"), {
        email: email.trim().toLowerCase(),
        subscribedAt: new Date(),
        status: "active",
      });

      setEmail("");
      showMessage(
        "Successfully subscribed! Thank you for joining us.",
        "success"
      );
    } catch (error) {
      console.error("Subscription error:", error);

      // Provide more specific error messages
      if (error.code === "permission-denied") {
        showMessage(
          "Subscription service temporarily unavailable. Please contact support.",
          "error"
        );
      } else if (error.code === "unavailable") {
        showMessage(
          "Network error. Please check your connection and try again.",
          "error"
        );
      } else {
        showMessage("Failed to subscribe. Please try again later.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const socialLinks = [
    {
      name: "Twitter",
      icon: <FaTwitter className="w-6 h-6" />,
      href: "https://twitter.com/ImpactProduction", // Replace with actual link
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-6 h-6" />,
      href: "https://www.linkedin.com/company/impact-production", // Replace with actual link
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="w-6 h-6" />,
      href: "https://www.instagram.com/impactproduction", // Replace with actual link
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          {/* Company Info */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="space-y-4 transform transition-transform duration-300"
          >
            <motion.h3
              className="text-2xl font-bold text-[#D4AF37] font-['Montserrat'] mb-4 relative"
              initial={{ scale: 1, textShadow: "0 0 0 rgba(212,175,55,0)" }}
              whileHover={{
                scale: 1.08,
                color: "#FFD700", // brighter gold on hover
                textShadow: "0 0 15px rgba(212,175,55,0.8)", // glow effect only on text
                transition: { duration: 0.4, ease: "easeInOut" },
              }}
            >
              Impact Production
              <motion.span
                className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{
                  scaleX: 1,
                  transition: { duration: 0.4, ease: "easeInOut" },
                }}
              />
            </motion.h3>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Promoting artistic excellence, fostering community connections,
              and empowering education through art and events across Ethiopia.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${link.name}`}
                  className="text-gray-400 hover:text-[#D4AF37] transform transition-all duration-300"
                  whileHover={{ scale: 1.3, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h4 className="text-lg font-semibold text-[#D4AF37] font-['Montserrat']">
              Services
            </h4>
            <ul className="space-y-2 text-sm sm:text-base">
              {[
                {
                  href: "/learnmore/graphic-digital",
                  text: "Graphic Design & Digital Marketing",
                },
                {
                  href: "/learnmore/events-exhibitions",
                  text: "Event Organizing & Exhibitions",
                },
                { href: "/learnmore/art-department", text: "Art Department" },
                {
                  href: "/learnmore/construction-architecture",
                  text: "Construction & Architectural Design",
                },
                { href: "/learnmore/it-web", text: "IT & Website Development" },
                { href: "/learnmore/media-printing", text: "Media & Printing" },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 hover:underline"
                  >
                    {item.text}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h4 className="text-lg font-semibold text-[#D4AF37] font-['Montserrat']">
              Company
            </h4>
            <ul className="space-y-2 text-sm sm:text-base">
              {[
                { href: "/", text: "Home" },
                { href: "/about", text: "About Us" },
                { href: "/departments", text: "Departments" },
                { href: "/portfolio", text: "Portfolio" },
                { href: "/events", text: "Events" },
                { href: "/contact", text: "Contact" },
                { href: "/admin", text: "Admin" },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 hover:underline"
                  >
                    {item.text}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h4 className="text-lg font-semibold text-[#D4AF37] font-['Montserrat']">
              Contact Information
            </h4>

            {/* Our Locations */}
            <HoverSection
              title="📍 Our Locations"
              items={[
                {
                  label: "Addis Ababa, Ethiopia",
                  link: "https://www.google.com/maps?q=Addis+Ababa,+Ethiopia",
                },
                {
                  label: "Adama, Ethiopia",
                  link: "https://www.google.com/maps?q=Adama,+Ethiopia",
                },
                {
                  label: "Arba Minch, Ethiopia",
                  link: "https://www.google.com/maps?q=Arba+Minch,+Ethiopia",
                },
                {
                  label: "Jijiga, Ethiopia",
                  link: "https://www.google.com/maps?q=Jijiga,+Ethiopia",
                },
              ]}
            />

            {/* Call Us */}
            <HoverSection
              title="📞 Call Us"
              items={[
                { label: "+251 (0) 939-228-142", link: "tel:+25139228142" },
                { label: "+251 (0) 935-228-142", link: "tel:+251935228142" },
              ]}
            />

            {/* Working Hours */}
            <HoverSection
              title="🕒 Working Hours"
              items={["Monday – Friday: 9 AM – 6 PM", "Saturday: 9 AM – 1 PM"]}
            />

            {/* Email */}
            <motion.div
              className="flex items-center space-x-2 text-gray-300 hover:text-[#D4AF37] mt-4"
              whileHover={{ scale: 1.05 }}
            >
              <span>📧</span>
              <a
                href="mailto:hello@impactproduction.com"
                className="hover:underline transition-colors duration-300"
              >
                hello@impactproduction.com
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-gray-800 mt-12 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold text-[#D4AF37] font-['Montserrat']">
              Stay Updated
            </h4>
            <p className="text-gray-300 text-sm sm:text-base">
              Subscribe to our newsletter for the latest updates and events
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                disabled={isLoading}
                required
              />
              <motion.button
                type="submit"
                disabled={isLoading}
                className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={
                  !isLoading
                    ? {
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(212, 175, 55, 0.5)",
                      }
                    : {}
                }
                whileTap={!isLoading ? { scale: 0.95 } : {}}
              >
                {isLoading ? "Please wait..." : "Subscribe"}
              </motion.button>
            </form>

            {/* Message Display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 p-3 rounded-lg text-sm text-center max-w-md mx-auto ${
                  messageType === "success"
                    ? "bg-green-900/20 text-green-300 border border-green-500/30"
                    : messageType === "error"
                    ? "bg-red-900/20 text-red-300 border border-red-500/30"
                    : "bg-gray-800/50 text-gray-300"
                }`}
              >
                {message}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p>
            &copy; 2025 Impact Production. All rights reserved. | Promoting
            Artistic Excellence Across Ethiopia
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
