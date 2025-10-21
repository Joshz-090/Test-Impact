import HeroSection from "./HoComp/HeroSection";
import { Link } from "react-router-dom";
import Transition from "../components/Transition";
import PartnersCarousel from "../components/PartnersCarousel";
import AboutSec from "./HoComp/AboutSec";
import Stats from "./HoComp/Stats";
import ServiceSec from "./HoComp/ServiceSec";
import MainTeam from "./HoComp/MainTeam";
import GallerySection from "./HoComp/GallerySection";
import backgroundImage from "../assets/images/R/Screenshot.png";

const Home = () => {
  const events = [
    {
      id: "exhibitions-events",
      title: "Exhibitions & Events",
      date: "Impact Highlights",
      description:
        "Organized large art exhibitions with 10+ organizations and 950+ guests at Hebar Art Gallery; hosted national youth drawing competitions; led awareness campaigns including the 16‑day anti‑sexual violence movement; produced the Annual Learning & Sharing Forum at Inter Luxury Hotel; supported KNH’s 50‑year operations in Ethiopia.",
      image:
        "https://images.unsplash.com/photo-1515165562835-c3b8c2e07f8f?w=400&h=300&fit=crop",
      to: "/impact/exhibitions-events",
    },
    {
      id: "community-impact",
      title: "Community Impact",
      date: "Social Programs",
      description:
        "Raised funds for Bethel Autism Center through events and sales; partnered with NGOs like CoSAP, Dalasalle, Abogida Young Women Leaders Association, and more; created platforms for child artists and education in schools.",
      image:
        "https://images.unsplash.com/photo-1515169067865-d9fdd1a1a307?w=400&h=300&fit=crop",
      to: "/impact/community-impact",
    },
    {
      id: "creative-services",
      title: "Creative & Professional Services",
      date: "Client Delivery",
      description:
        "Delivered graphic design, branding, website development, architectural design, and printing solutions; produced professional photography, digital campaigns, and promotional materials for NGOs and organizations.",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
      to: "/impact/creative-services",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      <div className="h-10 bg-gradient-to-b from-black/95 to-black"></div>
      <Transition />

      <AboutSec />
      <Stats
        primaryColor="#D4AF37" // Aligned with branding
        textColor="#f5f5f5"
        lightBg="#212121"
        stats={[
          { number: "8+", label: "Cities" },
          { number: "11K+", label: "Participants" },
          { number: "6+", label: "Years of Experience" }, // Fixed typo
          { number: "15+", label: "Successful Events" },
        ]}
        backgroundImage={backgroundImage}
      />
      <ServiceSec />
      <GallerySection />
      <MainTeam />
      {/* Key Achievements Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4 font-['Montserrat'] uppercase tracking-wider">
              Key Achievements
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Our impact through art and community engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={event.image}
                    alt={`Image for ${event.title} event`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-black mb-2 font-['Montserrat']">
                    {event.title}
                  </h3>
                  <p className="text-[#D4AF37] text-sm font-medium mb-3">
                    {event.date}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <Link
                    to={event.to}
                    className="text-[#D4AF37] font-semibold hover:text-[#B8941F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnersCarousel />
    </div>
  );
};

export default Home;
