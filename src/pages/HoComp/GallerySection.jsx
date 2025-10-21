import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const GallerySection = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch 6 random gallery images from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "gallery"),
      orderBy("createdAt", "desc"),
      limit(6)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Shuffle the array to get random images
        const shuffled = data.sort(() => 0.5 - Math.random());
        setGalleryImages(shuffled.slice(0, 6));
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading gallery images:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleImageClick = (imageId) => {
    navigate(`/gallery?image=${imageId}`);
  };

  const handleGoToGallery = () => {
    navigate("/gallery");
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4 font-['Montserrat']">
              Our <span className="text-[#D4AF37]">Gallery</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our creative work and memorable moments
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-64 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4 font-['Montserrat']">
            Our <span className="text-[#D4AF37]">Gallery</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our creative work and memorable moments
          </p>
        </div>

        {galleryImages.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                  onClick={() => handleImageClick(image.id)}
                >
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay with title on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                      <h3 className="text-xl font-semibold font-['Montserrat'] mb-2">
                        {image.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleGoToGallery}
                className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Go to Gallery
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Search and filter all images
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              Gallery Coming Soon
            </h3>
            <p className="text-gray-500 text-lg">
              Our gallery will be updated with amazing photos soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
