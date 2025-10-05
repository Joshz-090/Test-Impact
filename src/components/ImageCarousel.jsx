import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageCarousel = ({ images, className = "" }) => {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={`${className}`}>
        <img
          src={images[0]}
          alt="Event"
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x300?text=Image+Not+Found";
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="rounded-lg"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <img
                src={image}
                alt={`Event ${index + 1}`}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Image+Not+Found";
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
