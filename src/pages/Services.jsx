import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import LearnMoreButton from "../components/LearnMoreButton";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

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

  const services = [
    {
      id: "art",
      title: "Art & Exhibition Creation",
      description:
        "Curate and organize stunning art exhibitions that showcase Ethiopian talent and inspire audiences. From concept to execution, we handle every detail.",
      icon: "🎨",
      features: [
        "Exhibition Planning & Curation",
        "Artist Coordination",
        "Venue Selection & Setup",
        "Marketing & Promotion",
        "Opening Night Events",
        "Artwork Transportation",
      ],
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    },
    {
      id: "event",
      title: "Event Organization & Branding",
      description:
        "Create memorable brand experiences through strategic event planning and innovative branding solutions that leave lasting impressions.",
      icon: "📆",
      features: [
        "Brand Identity Development",
        "Event Concept Design",
        "Logistics Management",
        "Digital & Print Materials",
        "On-site Coordination",
        "Post-event Analysis",
      ],
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    },
    {
      id: "graphic",
      title: "Graphic Design & Content Creation",
      description:
        "Transform ideas into compelling visual stories with our comprehensive graphic design services that capture attention and convey messages effectively.",
      icon: "🖌",
      features: [
        "Logo Design & Branding",
        "Print & Digital Materials",
        "Packaging Design",
        "Social Media Graphics",
        "Infographics & Data Viz",
        "Typography & Layout",
      ],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    },
    {
      id: "digital",
      title: "Digital Marketing",
      description:
        "Drive growth and engagement through strategic digital marketing campaigns that reach your target audience and deliver measurable results.",
      icon: "🌐",
      features: [
        "Social Media Management",
        "Content Marketing",
        "SEO & SEM",
        "Email Campaigns",
        "Analytics & Reporting",
        "Influencer Partnerships",
      ],
      image:
        "https://images.unsplash.com/photo-1557838923-2985c318be48?w=400&h=300&fit=crop",
    },
    {
      id: "web",
      title: "Website & App Development",
      description:
        "Build cutting-edge digital experiences with responsive websites and mobile applications that engage users and drive results.",
      icon: "💻",
      features: [
        "Responsive Web Design",
        "E-commerce Solutions",
        "Mobile App Development",
        "UI/UX Design",
        "Custom CMS Development",
        "Performance Optimization",
      ],
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      id: "arc",
      title: "Architectural & Interior Design",
      description:
        "Transform spaces with innovative interior design and construction solutions that blend functionality with artistic expression.",
      icon: "🏛",
      features: [
        "Interior Design Planning",
        "Space Optimization",
        "Custom Furniture Design",
        "Renovation & Construction",
        "Material Selection",
        "Project Management",
      ],
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      id: "edu",
      title: "School Outreach & Educational Programs",
      description:
        "Empower the next generation through creative educational programs and school outreach initiatives that inspire learning and artistic expression.",
      icon: "🎓",
      features: [
        "Art Education Programs",
        "School Workshops",
        "Competition Organization",
        "Student Mentorship",
        "Curriculum Development",
        "Community Engagement",
      ],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    },
  ];

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

      {/* Services Grid */}
      <section className="py-20 section-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 partners-section">
            {services.map((service) => (
              <div
                key={service.id}
                className="value-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 text-4xl bg-black/20 p-2 rounded-lg">
                    {service.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black mb-3 font-montserrat">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{service.description}</p>

                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <LearnMoreButton id={service.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-montserrat">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              How we bring your creative vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              <div key={i} className="text-center timeline-item">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-black">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2 font-montserrat">
                  {step.title}
                </h3>
                <p className="text-gray-700">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/90 text-white backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-montserrat">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss how we can help bring your creative vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors shadow-lg text-lg transform hover:-translate-y-1 duration-300">
              Get a Quote
            </button>
            <button className="border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors text-lg transform hover:-translate-y-1 duration-300">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
