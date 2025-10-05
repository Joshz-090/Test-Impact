import React from "react";
import { useNavigate } from "react-router-dom";
import ImpactART from "../../assets/images/logos/black-bg-logo.png";
import ImpactARTwhite from "../../assets/images/logos/white-bg-logo.png";
import ImpactLOGO from "../../assets/images/logos/gold.png";
import ImpactLOGOwhite from "../../assets/images/logos/white.png";
import MissionVision3D from "./MissionVision3D";

const AboutSec = () => {
  const images = [ImpactART, ImpactARTwhite, ImpactLOGOwhite, ImpactLOGO];

  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-40 pb-2" id="pre-About">
      {/* Title Section */}
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-block pb-2 border-b-4 border-[#d4af37]">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#d4af37] mb-2">
            About <span className="text-black">Us</span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-between pb-12">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-8 md:mb-12 leading-relaxed">
              About <span className="text-[#d4af37]">Impact Production</span>
            </h1>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Impact Production is a creative powerhouse based in Ethiopia,
              dedicated to transforming ideas into impactful experiences. We
              bring together art, design, technology, and community engagement
              to create meaningful connections and lasting impressions.
            </p>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Our multidisciplinary team excels in event organizing, graphic
              design, digital marketing, web development, and architectural
              design. We work closely with organizations, NGOs, and artist
              communities to foster creativity and drive positive change.
            </p>
          </div>

          <AnimatedButton text="Learn more about our story" />
        </div>

        {/* Image Grid */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative pb-[100%] overflow-hidden rounded-xl shadow-lg bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={img}
                  alt={`Service ${index + 1}`}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-inherit transition-all duration-300 hover:opacity-90 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient Divider */}
      <div className="flex justify-center mt-12">
        <div className="w-4/5 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-full my-10" />
      </div>

      {/* Mission & Vision Section */}
      <MissionVision3D />
    </div>
  );
};

const AnimatedButton = ({ text }) => {
  const navigate = useNavigate();
  return (
    <button
      className="animated-button group"
      onClick={() => navigate("/about#about-us")}
    >
      <span className="button-text">{text}</span>
      <span className="button-icon">
        <svg width="50px" height="20px" viewBox="0 0 66 43" version="1.1">
          <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
            <path
              className="arrow-one"
              d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
              fill="#FFFFFF"
            />
            <path
              className="arrow-two"
              d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
              fill="#FFFFFF"
            />
            <path
              className="arrow-three"
              d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </span>
    </button>
  );
};

export default AboutSec;
