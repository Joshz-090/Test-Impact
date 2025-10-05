import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const IMPACT_CONTENT = {
  "exhibitions-events": {
    title: "Exhibitions & Events",
    intro:
      "Impact Production has organized and supported impactful exhibitions and events that connect people, ideas, and culture. These gatherings inspire dialogue, celebrate art, and strengthen community bonds.",
    bullets: [
      "Organized large art exhibitions with 10+ organizations and 950+ guests at Hebar Art Gallery.",
      "Hosted national youth drawing competitions with the Ethiopian Painters and Sculptors Association.",
      "Participated in the 16-day anti-sexual violence campaign; provided free health checkups and support for students.",
      "Organized the Annual Learning & Sharing Forum at Inter Luxury Hotel with 190+ participants across sectors.",
      "Supported KNH’s 50-year anniversary operations in Ethiopia with design and event contributions.",
    ],
  },
  "community-impact": {
    title: "Community Impact",
    intro:
      "Beyond events, Impact Production is deeply committed to social good. Through partnerships and fundraising initiatives, we support causes that uplift vulnerable communities and empower future generations.",
    bullets: [
      "Raised funds via events and sales (tickets, t-shirts) to support Bethel Autism Center.",
      "Collaborated with NGOs including CoSAP, Dalasalle, Abogida Young Women Leaders Association, Visual Arts Club, and others.",
      "Created platforms to promote child artists and educational engagement in schools.",
    ],
  },
  "creative-services": {
    title: "Creative & Professional Services",
    intro:
      "Our expertise spans design, technology, and media production. We provide professional services that help organizations communicate their message with clarity and impact.",
    bullets: [
      "Delivered graphic design, branding, website development, architectural design, and printing media services.",
      "Produced professional photography, digital campaigns, and promotional materials for NGOs and organizations.",
    ],
  },
};

export default function ImpactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const content = IMPACT_CONTENT[id];

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-black">Not Found</h1>
          <p className="text-gray-600 mb-6">
            This impact story is not available.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 font-montserrat text-black">
            {content.title}
          </h1>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {content.intro}
          </p>
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            {content.bullets.map((b, i) => (
              <li key={i} className="leading-snug">
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="border border-gray-300 px-5 py-2 rounded hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={() => navigate("/start-project")}
              className="bg-[#D4AF37] text-black font-medium px-6 py-2 rounded hover:bg-[#B8941F] transition"
            >
              Start a Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
