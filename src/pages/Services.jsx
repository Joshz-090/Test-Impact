import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import LearnMoreButton from "../components/LearnMoreButton";
import services from "../data/services";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleGetQuote = () => {
    navigate("/contact");
  };

  const handleScheduleConsultation = () => {
    navigate("/start-project");
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
      // Only initialize Three.js if canvas is available
      if (canvasRef.current) {
        initThreeJS();
      }

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
            start: "top 85%",
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
            start: "top 80%",
          },
        });
      });

      // Value cards with 3D hover
      gsap.utils.toArray(".value-card").forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          rotationX: 15,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        // 3D tilt effect on hover
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            rotationY: 5,
            rotationX: 5,
            scale: 1.03,
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
          start: "top 85%",
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // services data now sourced from ../data/services (six client-facing categories)

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#010120] to-[#dddddd] text-white font-sans overflow-hidden"
      ref={containerRef}
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: "block" }} // Ensure canvas is visible
        />
        <div className="relative z-10 text-center px-4 backdrop-blur-sm bg-black/30 rounded-2xl py-12 mx-4">
          <h1 className="hero-title text-4xl md:text-7xl font-bold mb-6 font-montserrat">
            Our <span className="text-[#D4AF37]">Services</span>
          </h1>
          <p className="hero-title text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
            Comprehensive creative solutions that transform your vision into
            reality across Ethiopia
          </p>
        </div>
      </section>

      {/* Section Title */}
      <section className="section-reveal py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 font-montserrat">
            Explore Our{" "}
            <span className="text-[#D4AF37]">Creative Services</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            Professional solutions tailored to bring your vision to life across
            Ethiopia.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 section-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 partners-section">
            {services.map((service) => (
              <div
                key={service.id}
                className="group value-card bg-black/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 h-full flex flex-col"
              >
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={
                      Array.isArray(service.images)
                        ? service.images[0]
                        : service.image
                    }
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4 text-3xl sm:text-4xl drop-shadow">
                    {service.icon}
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3 font-montserrat tracking-tight">
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-300/90 text-sm sm:text-base mb-4 leading-relaxed">
                      {Array.isArray(service.description)
                        ? service.description[0]
                        : service.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs sm:text-sm text-gray-300"
                        >
                          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <LearnMoreButton id={service.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-montserrat">
              Our <span className="text-[#D4AF37]">Process</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              How we bring your creative vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                num: "1",
                title: "Discovery",
                desc: "We start by understanding your vision, goals, and requirements to create a tailored approach.",
              },
              {
                num: "2",
                title: "Concept",
                desc: "Our creative team develops concepts and designs that align with your brand and objectives.",
              },
              {
                num: "3",
                title: "Execution",
                desc: "We bring your vision to life with meticulous attention to detail and quality craftsmanship.",
              },
              {
                num: "4",
                title: "Delivery",
                desc: "We ensure smooth delivery and provide ongoing support to maintain your creative success.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="text-center timeline-item bg-black/40 backdrop-blur-sm p-6 rounded-2xl hover:bg-black/60 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-black">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 font-montserrat">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black/90 to-gray-900 text-white backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-montserrat">
            Ready to <span className="text-[#D4AF37]">Start</span> Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss how we can help bring your creative vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#B8941F] transition-all shadow-lg text-lg transform hover:-translate-y-1 duration-300 hover:shadow-[#D4AF37]/50"
              onClick={handleGetQuote}
            >
              Get a Quote
            </button>
            <button
              className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition-all text-lg transform hover:-translate-y-1 duration-300"
              onClick={handleScheduleConsultation}
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
