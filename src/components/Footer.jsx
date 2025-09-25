import { motion } from "framer-motion";
import { useState } from "react";
import { collection, addDoc, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../firebase";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

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
        console.warn("Could not check for duplicates due to permissions:", checkError);
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
        status: "active"
      });

      setEmail("");
      showMessage("Successfully subscribed! Thank you for joining us.", "success");
    } catch (error) {
      console.error("Subscription error:", error);
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        showMessage("Subscription service temporarily unavailable. Please contact support.", "error");
      } else if (error.code === 'unavailable') {
        showMessage("Network error. Please check your connection and try again.", "error");
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
            className="space-y-4 transform transition-transform hover:scale-105 duration-300"
          >
            <h3 className="text-2xl font-bold text-[#D4AF37] font-['Montserrat'] mb-4">
              Impact Production
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Promoting artistic excellence, fostering community connections,
              and empowering education through art and events across Ethiopia.
            </p>
            <div className="flex space-x-4">
              {[
                {
                  path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
                },
                {
                  path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z",
                },
                {
                  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                },
                {
                  path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z",
                },
              ].map((icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-[#D4AF37] transform transition-all duration-300"
                  whileHover={{ scale: 1.3, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={icon.path} />
                  </svg>
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
                { href: "/learnmore/art", text: "Art & Exhibition Creation" },
                {
                  href: "/learnmore/event",
                  text: "Event Organization & Branding",
                },
                {
                  href: "/learnmore/graphic",
                  text: "Graphic Design & Content Creation",
                },
                { href: "/learnmore/digital", text: "Digital Marketing" },
                { href: "/learnmore/web", text: "Website & App Development" },
                {
                  href: "/learnmore/arc",
                  text: "Architectural & Interior Design",
                },
                { href: "/learnmore/edu", text: "School Outreach & Education" },
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
                { href: "/team", text: "Departments" },
                { href: "/portfolio", text: "Portfolio" },
                { href: "/events", text: "Events" },
                { href: "/contact", text: "Contact" },
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
              Contact
            </h4>
            <div className="space-y-2 text-sm sm:text-base">
              <motion.div
                className="text-gray-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span>📍</span>
                <span>Addis Ababa & Adama, Ethiopia</span>
              </motion.div>
              <motion.div
                className="text-gray-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span>📧</span>
                <a
                  href="mailto:hello@impactproduction.com"
                  className="hover:text-[#D4AF37] transition-colors duration-300 hover:underline"
                >
                  hello@impactproduction.com
                </a>
              </motion.div>
              <motion.div
                className="text-gray-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span>📞</span>
                <a
                  href="tel:+251911123456"
                  className="hover:text-[#D4AF37] transition-colors duration-300 hover:underline"
                >
                  +251 (0) 911-123-456
                </a>
              </motion.div>
              <motion.div
                className="text-gray-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <span>🕒</span>
                <span>Mon-Fri: 9AM-6PM</span>
              </motion.div>
            </div>
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
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
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
                whileHover={!isLoading ? {
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(212, 175, 55, 0.5)",
                } : {}}
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
