import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { MapPin, Phone, Mail, Clock } from "lucide-react"; // Using Lucide icons for modern look

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const offices = [
    {
      id: 1,
      name: "Addis Ababa Office",
      address: "Main Office, Addis Ababa",
      city: "Addis Ababa, Ethiopia",
      phone: "+251 (0) 911-123-456",
      email: "hello@impactproduction.com",
      hours: "Mon-Fri: 9AM-6PM",
      coordinates: [9.145, 40.4897],
    },
    {
      id: 2,
      name: "Adama Office",
      address: "Branch Office, Adama",
      city: "Adama, Ethiopia",
      phone: "+251 (0) 922-987-654",
      email: "adama@impactproduction.com",
      hours: "Mon-Fri: 8AM-5PM",
      coordinates: [8.537, 39.2705],
    },
  ];

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Placeholder for API call
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus(null), 3000);
    } catch (error) {
      setFormStatus("error");
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  useEffect(() => {
    let scene, camera, renderer, particles;
    let animationFrameId;

    const initThreeJS = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Create lightweight particle system
      const particlesGeometry = new THREE.BufferGeometry();
      const count = 300; // Reduced for performance
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffd700, // Modern gold color
        size: 0.015,
        transparent: true,
        opacity: 0.7,
      });

      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Animation loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        particles.rotation.y += 0.0015;
        renderer.render(scene, camera);
      };

      // IntersectionObserver for performance
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            animate();
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        },
        { threshold: 0 }
      );
      observer.observe(canvasRef.current);

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        observer.disconnect();
        cancelAnimationFrame(animationFrameId);
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        scene.remove(particles);
        renderer.dispose();
      };
    };

    // GSAP animations
    const ctx = gsap.context(() => {
      const cleanupThree = initThreeJS();

      // Hero animation
      gsap.from(".hero-title", {
        duration: 1.2,
        y: 80,
        opacity: 0,
        rotationX: 30,
        ease: "power3.out",
        stagger: 0.15,
      });

      // Office cards animation
      const officeCards = gsap.utils.toArray(".office-card");
      if (officeCards.length) {
        officeCards.forEach((card, i) => {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            rotationY: 20,
            duration: 0.7,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
      }

      // Form animation
      gsap.from(".contact-form", {
        y: 80,
        opacity: 0,
        rotationY: 20,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-form",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Quick contact animation
      const quickContactCards = gsap.utils.toArray(".quick-contact-card");
      if (quickContactCards.length) {
        quickContactCards.forEach((card, i) => {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            rotationX: 30,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".quick-contact-section",
              start: "top 85%",
            },
          });
        });
      }

      // FAQ animation
      const faqItems = gsap.utils.toArray(".faq-item");
      if (faqItems.length) {
        faqItems.forEach((item, i) => {
          gsap.from(item, {
            y: 40,
            opacity: 0,
            rotationY: 20,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
      }

      return () => cleanupThree();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#1E1E2F] to-[#F5F5F5] text-white font-sans"
      ref={containerRef}
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div className="relative z-10 text-center px-6 backdrop-blur-md bg-black/20 rounded-2xl py-12 max-w-4xl mx-auto">
          <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 font-['Montserrat'] tracking-tight">
            Get in <span className="text-[#FFD700]">Touch</span>
          </h1>
          <p className="hero-title text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Ready to start your next creative project? Let's collaborate to
            bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-['Montserrat'] tracking-tight">
              Our <span className="text-[#FFD700]">Offices</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visit us at one of our locations or reach out online.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {offices.map((office) => (
              <div
                key={office.id}
                className="office-card bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 font-['Montserrat']">
                  {office.name}
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start">
                    <MapPin
                      className="text-[#FFD700] mr-3 h-6 w-6"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-gray-700 font-medium">
                        {office.address}
                      </p>
                      <p className="text-gray-600">{office.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone
                      className="text-[#FFD700] mr-3 h-6 w-6"
                      aria-hidden="true"
                    />
                    <a
                      href={`tel:${office.phone}`}
                      className="text-gray-700 hover:text-[#FFD700] transition-colors font-medium"
                      aria-label={`Call ${office.name} at ${office.phone}`}
                    >
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail
                      className="text-[#FFD700] mr-3 h-6 w-6"
                      aria-hidden="true"
                    />
                    <a
                      href={`mailto:${office.email}`}
                      className="text-gray-700 hover:text-[#FFD700] transition-colors font-medium"
                      aria-label={`Email ${office.name} at ${office.email}`}
                    >
                      {office.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Clock
                      className="text-[#FFD700] mr-3 h-6 w-6"
                      aria-hidden="true"
                    />
                    <span className="text-gray-700 font-medium">
                      {office.hours}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-['Montserrat'] tracking-tight">
              Find <span className="text-[#FFD700]">Us</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visit our main office in Addis Ababa or our branch in Adama.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.567015956671!2d38.74679931475769!3d9.00804849353107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnMjkuMCJOIDM4wrA0NSc0OC4yIkU!5e0!3m2!1sen!2set!4v1634567890123"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Addis Ababa Office Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-['Montserrat'] tracking-tight">
              Send Us a <span className="text-[#FFD700]">Message</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how we can help bring your
              vision to life.
            </p>
          </div>

          <div className="contact-form bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
                    placeholder="Your full name"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    aria-required="true"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all"
                  placeholder="Tell us about your project..."
                  aria-required="true"
                ></textarea>
              </div>
              {formStatus && (
                <div
                  className={`text-center p-4 rounded-lg ${
                    formStatus === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {formStatus === "success"
                    ? "Thank you for your message! We'll get back to you soon."
                    : "Failed to send message. Please try again."}
                </div>
              )}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[#FFD700] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-[#E6C200] transition-all shadow-md hover:shadow-lg"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="quick-contact-section py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-['Montserrat'] tracking-tight">
              Quick <span className="text-[#FFD700]">Contact</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get in touch with us through your preferred method.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="quick-contact-card text-center p-6 rounded-xl bg-white/10 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-gray-900" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-['Montserrat']">
                Call Us
              </h3>
              <p className="text-gray-300 mb-2">Addis Ababa Office</p>
              <a
                href="tel:+251911123456"
                className="text-[#FFD700] hover:text-[#E6C200] transition-colors font-medium"
                aria-label="Call Addis Ababa Office at +251 (0) 911-123-456"
              >
                +251 (0) 911-123-456
              </a>
            </div>
            <div className="quick-contact-card text-center p-6 rounded-xl bg-white/10 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-gray-900" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-['Montserrat']">
                Email Us
              </h3>
              <p className="text-gray-300 mb-2">General Inquiries</p>
              <a
                href="mailto:hello@impactproduction.com"
                className="text-[#FFD700] hover:text-[#E6C200] transition-colors font-medium"
                aria-label="Email us at hello@impactproduction.com"
              >
                hello@impactproduction.com
              </a>
            </div>
            <div className="quick-contact-card text-center p-6 rounded-xl bg-white/10 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-6 w-6 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-['Montserrat']">
                Live Chat
              </h3>
              <p className="text-gray-300 mb-2">Available 24/7</p>
              <button
                onClick={() => alert("Live chat feature coming soon!")}
                className="text-[#FFD700] hover:text-[#E6C200] transition-colors font-medium"
                aria-label="Start live chat"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-['Montserrat'] tracking-tight">
              Frequently Asked <span className="text-[#FFD700]">Questions</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common questions about our services and process.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What services do you offer?",
                answer:
                  "We offer comprehensive creative services including art exhibitions, event organization, graphic design, digital marketing, web development, architectural design, and educational programs.",
              },
              {
                question:
                  "Do you work with schools and educational institutions?",
                answer:
                  "Yes, we have extensive experience working with schools and educational institutions, including our partnerships with Marconal Institute of Music & Painting and our school outreach programs.",
              },
              {
                question: "What areas do you serve in Ethiopia?",
                answer:
                  "We primarily serve Addis Ababa and Adama, but we work with clients and partners across Ethiopia for various projects and events.",
              },
              {
                question: "What is your pricing structure?",
                answer:
                  "We offer flexible pricing based on project scope and requirements. We provide detailed quotes after understanding your specific needs. Contact us for a personalized estimate.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="faq-item bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-['Montserrat']">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
