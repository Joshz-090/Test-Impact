import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const Departments = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

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

      // Hero animation with enhanced 3D effect
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

      // Timeline items with alternating 3D flip effect
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

      // Department cards with 3D hover and staggered reveal
      gsap.utils.toArray(".value-card").forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          rotationX: 20,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        // Enhanced 3D tilt effect on hover with shadow
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const rotateY = (x / rect.width - 0.5) * 20;
          const rotateX = (y / rect.height - 0.5) * -20;
          gsap.to(card, {
            rotationY: rotateY,
            rotationX: rotateX,
            scale: 1.03,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            duration: 0.3,
            ease: "power2.out",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const departments = [
    {
      id: 1,
      name: "Event Organizing Department",
      description:
        "Dedicated to creating unique event concepts that align with artistic visions, organizing exhibitions, and fostering connections in the artistic community.",
      icon: "📅",
      teamSize: "6 Members",
      specialties: [
        "Event Planning & Coordination",
        "Exhibition Organization",
        "Artist Showcases",
        "Community Engagement",
        "Logistics Management",
        "Promotional Campaigns",
      ],
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      color: "from-yellow-500 to-orange-500",
      manager: "Metasebiya Moges (Designer)",
    },
    {
      id: 2,
      name: "Design and Marketing Department",
      description:
        "Excels in graphic design, digital marketing, content creation, and creating visually appealing promotional materials to showcase artists' work effectively.",
      icon: "🖌️",
      teamSize: "8 Members",
      specialties: [
        "Graphic Design",
        "Digital Marketing",
        "Content Creation",
        "Brand Identity",
        "Social Media Strategy",
        "Promotional Materials",
      ],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-500",
      manager: "Yohanes Ayele (Artist)",
    },
    {
      id: 3,
      name: "Art Department",
      description:
        "Focused on promoting artistic excellence, curating exhibitions, supporting young artists, and creating impactful art experiences that resonate with audiences.",
      icon: "🎨",
      teamSize: "5 Members",
      specialties: [
        "Hyper-realistic Drawings",
        "Art Curation",
        "Exhibition Design",
        "Artist Support",
        "Custom Graphite Drawings",
        "Social Media Management",
      ],
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      color: "from-purple-500 to-pink-500",
      manager: "Lijeshet Abebe (Artist)",
    },
    {
      id: 4,
      name: "Construction Department",
      description:
        "Specializes in architectural design, interior design, construction management, and creating innovative spaces for art exhibitions and events.",
      icon: "🏗️",
      teamSize: "9 Members",
      specialties: [
        "Architectural Design",
        "Interior Design",
        "Construction Management",
        "Space Planning",
        "Renovation Projects",
        "Project Supervision",
      ],
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      color: "from-red-500 to-pink-500",
      manager: "Mikias Tadese (Architect)",
    },
    {
      id: 5,
      name: "IT Department",
      description:
        "Handles website design, front-end and back-end development, UI/UX, and digital infrastructure to support the company's online presence and operations.",
      icon: "💻",
      teamSize: "7 Members",
      specialties: [
        "Website Development",
        "Front-end & Back-end",
        "UI/UX Design",
        "Custom Software",
        "Digital Solutions",
        "System Maintenance",
      ],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      color: "from-green-500 to-teal-500",
      manager: "Not Specified",
    },
  ];

  const partners = [
    "Abogida Young Women Leaders Association",
    "Bethel Autism Center",
    "Marconal Institute of Music and Painting",
    "Simple Restaurant",
    "Ethiopian Painters and Sculptors Association - Adama Branch",
    "Dalasalle Community Development Organization",
    "Sun Art Store",
    "Visual Arts Club",
    "COSAP",
    "Tsgereda Institute of Fashion Design and Embroidery",
  ];

  const timelineItems = [
    {
      date: "December 9, 2016",
      title: "16 Days of Activism Campaign on GBV",
      description:
        "In collaboration with EWLA-Adama branch and others, held awareness campaign, town cleaning, and provided health checkup services for participants.",
    },
    {
      date: "November 29, 2016",
      title: "Anti-Sexual Violence Movement Campaign",
      description:
        "Organized platform marking the 16-day campaign, provided investigation services, and collected feminine hygiene products for distribution to students.",
    },
    {
      date: "November 6, 2016",
      title: "KNH 50 Year Operations in Ethiopia",
      description:
        "Participated in the celebration of KNH's 50th anniversary in Ethiopia, showcasing designs and support.",
    },
    {
      date: "December 12, 2016",
      title: "Support for Bethel Autism Center",
      description:
        "Collected funds through tickets, t-shirts, and other items to support Bethel Autism Center.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#010120] to-[#999999] text-white font-sans"
      ref={containerRef}
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div className="relative z-10 text-center px-4 backdrop-blur-md bg-black/40 rounded-2xl py-12">
          <h1 className="hero-title text-4xl md:text-7xl font-bold mb-6 font-['Montserrat']">
            Our <span className="text-[#D4AF37]">Departments</span>
          </h1>
          <p className="hero-title text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
            Specialized teams collaborating to promote artistic excellence and
            create impactful experiences across Ethiopia
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-20 section-reveal ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="value-card bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-700 cursor-pointer"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 text-4xl">
                    {dept.icon}
                  </div>
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {dept.teamSize}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-3 font-['Montserrat']">
                    {dept.name}
                  </h3>
                  <p className="text-gray-300 mb-4">{dept.description}</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Manager: {dept.manager}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#D4AF37] mb-2 uppercase tracking-wide">
                      Specialties
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {dept.specialties.map((specialty, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-300"
                        >
                          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2"></div>
                          {specialty}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors">
                    Meet the Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-800 section-reveal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-['Montserrat']">
              Company <span className="text-[#D4AF37]">Timeline</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Key events and milestones in our journey
            </p>
          </div>

          <div className="space-y-12 relative before:absolute before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:h-full before:bg-gray-700 md:before:left-1/4">
            {timelineItems.map((item, index) => (
              <div
                key={index}
                className={`timeline-item relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="md:w-1/4 text-[#D4AF37] font-semibold text-lg bg-gray-900 px-4 py-2 rounded-lg text-center">
                  {item.date}
                </div>
                <div className="md:w-3/4 bg-gray-900 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-2 font-['Montserrat']">
                    {item.title}
                  </h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-20 bg-gray-900 section-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-['Montserrat']">
              Cross-Department{" "}
              <span className="text-[#D4AF37]">Collaboration</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              How our teams unite to deliver transformative art and event
              experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 font-['Montserrat']">
                Unified Vision
              </h3>
              <p className="text-gray-300">
                All departments align to promote artistic excellence and
                community impact.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 font-['Montserrat']">
                Seamless Integration
              </h3>
              <p className="text-gray-300">
                Combining expertise in art, design, events, construction, and IT
                for innovative solutions.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 font-['Montserrat']">
                Quality Assurance
              </h3>
              <p className="text-gray-300">
                Maintaining high standards across all phases for exceptional
                results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-800 partners-section section-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-['Montserrat']">
              Our <span className="text-[#D4AF37]">Partners</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Collaborating with organizations to strengthen community
              relationships through art
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="partner-logo bg-gray-900 p-6 rounded-xl text-center text-gray-200 font-medium hover:bg-gray-700 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Overview */}
      <section className="py-20 bg-gray-900 section-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-['Montserrat']">
              Department <span className="text-[#D4AF37]">Overview</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our specialized teams at a glance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="text-center p-4 bg-gray-800 rounded-xl"
              >
                <div className="text-4xl mb-4">{dept.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 font-['Montserrat']">
                  {dept.name}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{dept.teamSize}</p>
                <div className="text-xs text-gray-500">
                  {dept.specialties.slice(0, 2).map((specialty, index) => (
                    <div key={index} className="mb-1">
                      {specialty}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-20 bg-gray-800 section-reveal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-['Montserrat']">
            Join Our Creative Team
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We're seeking passionate individuals to help create impactful art
            experiences in Ethiopia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors shadow-lg text-lg">
              View Open Positions
            </button>
            <button className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors text-lg">
              Send Your Portfolio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Departments;
