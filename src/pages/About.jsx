import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import {
  FaPaintBrush,
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaGlobeAfrica,
  FaLeaf,
} from "react-icons/fa";
import MissionVision from "../components/MissionVision";

import cosap from "../assets/images/logos/1 final.jpg";
import videos from "../assets/video/logo video.mp4";
import PartnersCarousel from "../components/PartnersCarousel";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const scrollTo = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Three.js setup
  useEffect(() => {
    let scene, camera, renderer, particles;

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

      // Create particle system
      const particlesGeometry = new THREE.BufferGeometry();
      const count = 1000;
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      const particlesMaterial = new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 0.02,
        transparent: true,
        opacity: 0.8,
      });

      particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.002;
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    };

    // GSAP animations
    const ctx = gsap.context(() => {
      initThreeJS();

      // Hero animation with 3D effect
      gsap.from(".hero-title", {
        duration: 1.5,
        y: 100,
        opacity: 0,
        rotationX: 45,
        ease: "power3.out",
        stagger: 0.2,
      });

      // Section reveal with 3D rotation
      gsap.utils.toArray(".section-reveal").forEach((section) => {
        gsap.from(section, {
          y: 100,
          opacity: 0,
          rotationY: 30,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });

      // Timeline with 3D flip effect
      gsap.utils.toArray(".timeline-item").forEach((item, i) => {
        gsap.from(item, {
          x: i % 2 === 0 ? -150 : 150,
          opacity: 0,
          rotationY: 90,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
          },
        });
      });

      // Stats animation with counting effect
      gsap.utils.toArray(".stat-item").forEach((stat, index) => {
        // Card animation
        gsap.from(stat, {
          y: 80,
          opacity: 0,
          scale: 0.8,
          duration: 1,
          delay: index * 0.15,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });

      // Value cards with smoother animation
      gsap.utils.toArray(".value-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        // 3D tilt effect on hover
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            rotationY: 10,
            rotationX: 10,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Partner logos with 3D effect
      gsap.from(".partner-logo", {
        y: 50,
        opacity: 0,
        rotationX: 45,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".partners-section",
          start: "top 80%",
        },
      });

      gsap.from(".company-image", {
        y: 100,
        opacity: 0,
        rotationY: 30,
        duration: 1.2,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".company-section",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".company-content", {
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".company-section",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Data arrays (unchanged)
  const timeline = [
    {
      year: "2023",
      mounth: "sep",
      title: "Foundation",
      description: "Launched as collaborative art studio in Addis Ababa",
    },
    {
      year: "2024",
      mounth: "Jan",
      title: "First Exhibition",
      description: "Showcased 30+ Ethiopian artists",
    },
    {
      year: "2023",
      mounth: "sep",
      title: "Digital Expansion",
      description: "Added web & digital services",
    },
    {
      year: "2024",
      mounth: "sep",
      title: "Partnerships",
      description: "Collaborated with major organizations",
    },
    {
      year: "2024",
      mounth: "sep",
      title: "Gallery Success",
      description: "950+ attendees at Hebar events",
    },
    {
      year: "2024",
      mounth: "sep",
      title: "Education",
      description: "Launched national competitions",
    },
    {
      year: "2025",
      mounth: "sep",
      title: "Social Impact",
      description: "Creative campaigns reaching 50K+",
    },
  ];

  const values = [
    {
      title: "Artistic Excellence",
      description: "Highest standards of creative expression",
      icon: <FaPaintBrush className="text-4xl" />,
    },
    {
      title: "Youth Empowerment",
      description: "Nurturing next-gen Ethiopian creatives",
      icon: <FaUsers className="text-4xl" />,
    },
    {
      title: "Innovation",
      description: "Blending tradition with technology",
      icon: <FaLightbulb className="text-4xl" />,
    },
    {
      title: "Community First",
      description: "Projects with measurable social benefit",
      icon: <FaHandshake className="text-4xl" />,
    },
    {
      title: "Cultural Legacy",
      description: "Preserving Ethiopian heritage",
      icon: <FaGlobeAfrica className="text-4xl" />,
    },
    {
      title: "Sustainability",
      description: "Eco-conscious creative practice",
      icon: <FaLeaf className="text-4xl" />,
    },
  ];

  const stats = [
    { value: "6+", label: "Years", description: "Of creative excellence" },
    { value: "950+", label: "Attendees", description: "At our events" },
    { value: "25+", label: "Team", description: "Creative professionals" },
    { value: "50K+", label: "Reach", description: "Annual impact" },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#010120] to-[#888888] text-white font-sans"
      ref={containerRef}
    >
      {/* Hero Section with 3D Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div className="relative z-10 text-center px-4 backdrop-blur-sm bg-black/30 rounded-2xl py-12">
          <h1 className="hero-title text-4xl md:text-7xl font-bold mb-6 font-montserrat">
            <span className="text-[#D4AF37] block mb-2 drop-shadow-lg">
              Impact Production
            </span>
            Creative Revolution
          </h1>
          <p className="hero-title text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Where Ethiopian art meets social transformation
          </p>
          <div className="hero-title mt-12">
            <button
              className="bg-[#D4AF37] hover:bg-[#c9a227] text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-[#D4AF37]/50"
              onClick={() => scrollTo("#evolution")}
            >
              Explore Our Journey
            </button>
          </div>
        </div>
      </section>

      {/* Mission & Vision (componentized) */}
      <MissionVision />

      {/*  Company Section */}
      <section className="company-section py-20 section-reveal backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image Gallery */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-6">
                <div className="company-image relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={cosap}
                    alt="Company event or workspace"
                    className="w-full h-80 object-cover transform hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white text-sm">
                      Our Creative Studio
                    </span>
                  </div>
                </div>
                <div className="company-image relative overflow-hidden rounded-2xl shadow-2xl mt-12">
                  <video
                    src={videos} // replace with your video path
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-80 object-cover transform hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white text-sm">
                      Team Collaboration
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Company Description */}
            <div className="company-content w-full lg:w-1/2" id="about-us">
              <h2 className="text-4xl font-bold mb-6 font-montserrat">
                About <span className="text-[#D4AF37]">Our Company</span>
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Impact Production is a pioneering creative agency based in
                Ethiopia, dedicated to merging artistic excellence with social
                transformation. Since our founding in 2018, we've been at the
                forefront of Ethiopia's creative revolution, empowering local
                talent while preserving cultural heritage.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Our multidisciplinary team of 25+ creative professionals
                specializes in visual arts, digital media, and community-focused
                projects that create measurable impact. We believe in the power
                of creativity to drive positive change and build a more vibrant,
                connected Ethiopia.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center">
                  <div className="bg-[#D4AF37] rounded-full p-2 mr-3">
                    <FaUsers className="text-black text-lg" />
                  </div>
                  <div>
                    <div className="font-bold">25+</div>
                    <div className="text-sm text-gray-400">
                      Creative Experts
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-[#D4AF37] rounded-full p-2 mr-3">
                    <FaGlobeAfrica className="text-black text-lg" />
                  </div>
                  <div>
                    <div className="font-bold">50+</div>
                    <div className="text-sm text-gray-400">
                      Projects Completed
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="bg-[#D4AF37] hover:bg-[#c9a227] text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-[#D4AF37]/50 flex items-center"
                onClick={() => scrollTo("#about-us")}
              >
                Learn More About Us
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 section-reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-item text-center bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-md p-6 rounded-2xl hover:scale-105 transition-all duration-500 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:shadow-lg hover:shadow-[#D4AF37]/10 relative overflow-hidden group"
              >
                {/* Animated background element */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Animated number with counting effect */}
                <div className="text-5xl md:text-6xl font-bold text-[#D4AF37] mb-2 relative">
                  {stat.value}
                </div>

                <div className="text-xl font-medium font-montserrat relative z-10">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-300 mt-2 relative z-10">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 section-reveal bg-black/30 backdrop-blur-sm"
        id="evolution"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 md:mb-16 font-montserrat">
            Our <span className="text-[#D4AF37]">Evolution</span>
          </h2>

          <div className="relative">
            {/* Vertical timeline line for desktop */}
            <div className="absolute left-1/2 h-full w-1 bg-gradient-to-b from-[#D4AF37] to-transparent transform -translate-x-1/2 hidden md:block"></div>
            {/* Vertical timeline line for mobile */}
            <div className="absolute left-12 h-full w-0.5 bg-[#D4AF37]/50 md:hidden"></div>

            <div className="space-y-12 md:space-y-24">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`timeline-item relative ${
                    index % 2 === 0 ? "md:pr-1/2" : "md:pl-1/2"
                  }`}
                >
                  <div
                    className={`bg-black/70 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border-l-4 border-[#D4AF37] max-w-full md:max-w-md ${
                      index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <div className="flex items-start">
                      {/* Year marker */}
                      <div className="bg-[#D4AF37] text-black p-3 rounded-lg mr-4 flex-shrink-0 grid items-center justify-center col-span-1">
                        <div className="text-lg md:text-xl font-bold">
                          {item.year}
                        </div>
                        <div className="text-sm md:text-lg font-bold flex justify-center">
                          {item.mounth}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold mb-2 font-montserrat">
                          {item.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Circular marker for desktop */}
                  {index < timeline.length - 1 && (
                    <div className="hidden md:block absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#D4AF37] rounded-full border-4 border-black/50 shadow-lg"></div>
                  )}
                  {/* Dot marker for mobile */}
                  {index < timeline.length - 1 && (
                    <div className="md:hidden absolute left-12 top-full transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 section-reveal bg-gray-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 font-montserrat">
            Our <span className="text-[#D4AF37]">Creative DNA</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card bg-black/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-[#D4AF37]/30 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Background shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                {/* Icon container - fixed position, no scaling */}
                <div className="bg-[#D4AF37]/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 relative z-10">
                  {value.icon}
                </div>

                <h3 className="text-xl font-bold mb-3 font-montserrat relative z-10">
                  {value.title}
                </h3>
                <p className="text-base text-gray-300 relative z-10">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 section-reveal bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 font-montserrat">
            Ready to{" "}
            <span className="text-[#D4AF37] animate-pulse">Create</span> With
            Us?
          </h2>

          <div className="mb-12 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#f1c84c] rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-200 animate-tilt"></div>
            <div className="relative bg-black/70 backdrop-blur-sm rounded-2xl p-8">
              <p className="text-xl mb-6">
                Whether you're an artist, organization, or community partner,
                let's collaborate to build a more creative Ethiopia.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  className="bg-[#D4AF37] hover:bg-[#c9a227] text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-[#D4AF37]/50"
                  onClick={() => navigate("/contact")}
                >
                  <svg
                    className="w-5 h-5 mr-2 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Contact Us
                </button>
                <button
                  className="bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 border border-white rounded-full transition-all transform hover:scale-110"
                  onClick={() => navigate("/portfolio")}
                >
                  <svg
                    className="w-5 h-5 mr-2 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    ></path>
                  </svg>
                  View Portfolio
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div
              className="location-card bg-black/50 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all hover:scale-105 cursor-pointer"
              onClick={() =>
                openInNewTab(
                  "https://www.google.com/maps?q=Abysinia+Plaza,+Addis+Ababa"
                )
              }
            >
              <h4 className="font-bold text-lg mb-2">Addis Ababa</h4>
              <p className="text-sm text-gray-300">Abysinia Plaza, 3rd Floor</p>
              <div className="mt-4">
                <a
                  href="https://www.google.com/maps?q=Abysinia+Plaza,+Addis+Ababa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline flex items-center text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  View on Map
                </a>
              </div>
            </div>
            <div
              className="location-card bg-black/50 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all hover:scale-105 cursor-pointer"
              onClick={() =>
                openInNewTab(
                  "https://www.google.com/maps?q=Adama+Cinema,+Adama"
                )
              }
            >
              <h4 className="font-bold text-lg mb-2">Adama</h4>
              <p className="text-sm text-gray-300">
                Posta Bet (near Adama Cinema)
              </p>
              <div className="mt-4">
                <a
                  href="https://www.google.com/maps?q=Adama+Cinema,+Adama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline flex items-center text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  View on Map
                </a>
              </div>
            </div>
            <div
              className="location-card bg-black/50 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all hover:scale-105 cursor-pointer"
              onClick={() =>
                openInNewTab(
                  "https://www.google.com/maps?q=Arba+Minch,+Ethiopia"
                )
              }
            >
              <h4 className="font-bold text-lg mb-2">Arba Minch</h4>
              <p className="text-sm text-gray-300">
                Southern Nations, Nationalities, and Peoples' Region
              </p>
              <div className="mt-4">
                <a
                  href="https://www.google.com/maps?q=Arba+Minch,+Ethiopia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline flex items-center text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  View on Map
                </a>
              </div>
            </div>
            <div
              className="location-card bg-black/50 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all hover:scale-105 cursor-pointer"
              onClick={() =>
                openInNewTab("https://www.google.com/maps?q=Gigiga,+Ethiopia")
              }
            >
              <h4 className="font-bold text-lg mb-2">Gigiga</h4>
              <p className="text-sm text-gray-300">Eastern Ethiopia</p>
              <div className="mt-4">
                <a
                  href="https://www.google.com/maps?q=Gigiga,+Ethiopia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline flex items-center text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  View on Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="partners-section section-reveal">
        <PartnersCarousel />{" "}
      </section>
    </div>
  );
};

export default About;
