import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const offices = [
    {
      id: 1,
      name: "Addis Ababa Office",
      address: "Main Office, Addis Ababa",
      city: "Addis Ababa, Ethiopia",
      phone: "+251 (0) 911-123-456",
      email: "hello@impactproduction.com",
      hours: "Mon-Fri: 9AM-6PM",
      coordinates: "9.1450,40.4897",
    },
    {
      id: 2,
      name: "Adama Office",
      address: "Branch Office, Adama",
      city: "Adama, Ethiopia",
      phone: "+251 (0) 922-987-654",
      email: "adama@impactproduction.com",
      hours: "Mon-Fri: 8AM-5PM",
      coordinates: "8.5370,39.2705",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 font-['Montserrat']">
            Get in <span className="text-[#D4AF37]">Touch</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto">
            Ready to start your next creative project? Let's discuss how we can
            bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Our <span className="text-[#D4AF37]">Offices</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit us at one of our locations or reach out online
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {offices.map((office) => (
              <div key={office.id} className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold text-black mb-4 font-['Montserrat']">
                  {office.name}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-[#D4AF37] mr-3 mt-1">📍</div>
                    <div>
                      <p className="text-gray-700">{office.address}</p>
                      <p className="text-gray-700">{office.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#D4AF37] mr-3">📞</div>
                    <a
                      href={`tel:${office.phone}`}
                      className="text-gray-700 hover:text-[#D4AF37] transition-colors"
                    >
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#D4AF37] mr-3">📧</div>
                    <a
                      href={`mailto:${office.email}`}
                      className="text-gray-700 hover:text-[#D4AF37] transition-colors"
                    >
                      {office.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#D4AF37] mr-3">🕒</div>
                    <span className="text-gray-700">{office.hours}</span>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Find <span className="text-[#D4AF37]">Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit our main office in Addis Ababa
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-200 relative">
              {/* Google Maps Embed Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-gray-600">Interactive Google Map</p>
                  <p className="text-sm text-gray-500">Addis Ababa, Ethiopia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Send Us a <span className="text-[#D4AF37]">Message</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how we can help bring your
              vision to life.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="Your full name"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="your@email.com"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[#D4AF37] text-black px-8 py-4 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors shadow-lg text-lg"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-['Montserrat']">
              Quick <span className="text-[#D4AF37]">Contact</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get in touch with us through your preferred method
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-['Montserrat']">
                Call Us
              </h3>
              <p className="text-gray-300 mb-2">Addis Ababa Office</p>
              <a
                href="tel:+251911123456"
                className="text-[#D4AF37] hover:text-[#B8941F] transition-colors"
              >
                +251 (0) 911-123-456
              </a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-['Montserrat']">
                Email Us
              </h3>
              <p className="text-gray-300 mb-2">General Inquiries</p>
              <a
                href="mailto:hello@impactproduction.com"
                className="text-[#D4AF37] hover:text-[#B8941F] transition-colors"
              >
                hello@impactproduction.com
              </a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-['Montserrat']">
                Live Chat
              </h3>
              <p className="text-gray-300 mb-2">Available 24/7</p>
              <button className="text-[#D4AF37] hover:text-[#B8941F] transition-colors">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Frequently Asked <span className="text-[#D4AF37]">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Common questions about our services and process
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2 font-['Montserrat']">
                What services do you offer?
              </h3>
              <p className="text-gray-700">
                We offer comprehensive creative services including art
                exhibitions, event organization, graphic design, digital
                marketing, web development, architectural design, and
                educational programs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2 font-['Montserrat']">
                Do you work with schools and educational institutions?
              </h3>
              <p className="text-gray-700">
                Yes, we have extensive experience working with schools and
                educational institutions, including our partnerships with
                Marconal Institute of Music & Painting and our school outreach
                programs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2 font-['Montserrat']">
                What areas do you serve in Ethiopia?
              </h3>
              <p className="text-gray-700">
                We primarily serve Addis Ababa and Adama, but we work with
                clients and partners across Ethiopia for various projects and
                events.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-2 font-['Montserrat']">
                What is your pricing structure?
              </h3>
              <p className="text-gray-700">
                We offer flexible pricing based on project scope and
                requirements. We provide detailed quotes after understanding
                your specific needs. Contact us for a personalized estimate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
