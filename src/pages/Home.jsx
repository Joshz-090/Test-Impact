import HeroSection from "./HoComp/HeroSection";
import Transition from "../components/Transition";
import PartnersCarousel from "../components/PartnersCarousel";
import HomeComp from "./HoComp/HomeComp";
import HomeComp3 from "./HoComp/HomeComp3";
import HomeComp4 from "./HoComp/HomeComp4";
import HomeComp6 from "./HoComp/HomeComp6";
import backgroundImage from "../assets/images/R/Screenshot.png";

const Home = () => {
  const events = [
    {
      id: 1,
      title: "Hebar Art Gallery Exhibition",
      date: "Recent Event",
      description:
        "Successfully hosted art gallery events with 950+ attendees, showcasing local Ethiopian artists and fostering community engagement.",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "National Drawing Competition",
      date: "Ongoing Program",
      description:
        "Organizing national drawing competitions for young artists, empowering the next generation of Ethiopian creatives.",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Awareness Campaigns",
      date: "Community Outreach",
      description:
        "Leading multiple awareness campaigns on GBV, health, and education through creative art and design initiatives.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      <div className="h-10 bg-gradient-to-b from-black/95 to-black"></div>
      <Transition />

      <HomeComp />
      <HomeComp3
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
      <HomeComp4 />
      <HomeComp6 />
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
                  <button className="text-[#D4AF37] font-semibold hover:text-[#B8941F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                    Learn More →
                  </button>
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
