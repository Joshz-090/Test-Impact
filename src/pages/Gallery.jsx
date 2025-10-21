import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Gallery = () => {
  const [searchParams] = useSearchParams();
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, title

  // Check if there's a specific image ID in the URL
  const imageId = searchParams.get("image");

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGalleryImages(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error loading gallery images:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle specific image from URL
  useEffect(() => {
    if (imageId && galleryImages.length > 0) {
      const image = galleryImages.find((img) => img.id === imageId);
      if (image) {
        setSelectedImage(image);
        setIsModalOpen(true);
      }
    }
  }, [imageId, galleryImages]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(galleryImages.map((img) => img.category).filter(Boolean)),
    ];
    return uniqueCategories.sort();
  }, [galleryImages]);

  // Filter and search logic with title prioritization
  const filteredImages = useMemo(() => {
    let filtered = galleryImages;

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((img) => img.category === selectedCategory);
    }

    // Apply search query with title prioritization
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((img) => {
        const titleMatch = img.title?.toLowerCase().includes(query);
        const descriptionMatch = img.description?.toLowerCase().includes(query);

        // Prioritize title matches
        if (titleMatch) return true;
        if (descriptionMatch) return true;
        return false;
      });

      // Sort search results: title matches first, then description matches
      filtered.sort((a, b) => {
        const aTitleMatch = a.title?.toLowerCase().includes(query);
        const bTitleMatch = b.title?.toLowerCase().includes(query);

        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        return 0;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt?.toDate()) - new Date(b.createdAt?.toDate())
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title?.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt?.toDate()) - new Date(a.createdAt?.toDate())
        );
        break;
    }

    return filtered;
  }, [galleryImages, searchQuery, selectedCategory, sortBy]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory || sortBy !== "newest";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4 font-['Montserrat']">
              Our <span className="text-[#D4AF37]">Gallery</span>
            </h1>
            <p className="text-lg text-gray-600">
              Loading our creative work...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg h-64 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16" onKeyDown={handleKeyDown}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4 font-['Montserrat']">
            Our <span className="text-[#D4AF37]">Gallery</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our creative work, events, and memorable moments
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>

              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFilters || hasActiveFilters
                    ? "bg-[#D4AF37] text-black"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                    />
                  </svg>
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {
                        [
                          searchQuery,
                          selectedCategory,
                          sortBy !== "newest",
                        ].filter(Boolean).length
                      }
                    </span>
                  )}
                </span>
              </button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filter Sidebar */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    Showing {filteredImages.length} of {galleryImages.length}{" "}
                    images
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {galleryImages.length > 0 ? (
          <>
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                    onClick={() => handleImageClick(image)}
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
                        <h3 className="text-lg font-semibold font-['Montserrat'] mb-2">
                          {image.title}
                        </h3>
                        <p className="text-sm text-gray-200">
                          Click to view details
                        </p>
                      </div>
                    </div>

                    {/* Category Badge */}
                    {image.category && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-[#D4AF37] text-black px-2 py-1 rounded-full text-xs font-semibold">
                          {image.category}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  No Images Found
                </h3>
                <p className="text-gray-500 text-lg mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
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

      {/* Modal for image details */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex">
              {/* Image */}
              <div className="flex-1">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="w-96 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-black font-['Montserrat']">
                    {selectedImage.title}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="flex-1">
                  <p className="text-gray-600 mb-4">
                    {selectedImage.description}
                  </p>

                  {selectedImage.category && (
                    <div className="mb-4">
                      <span className="inline-block bg-[#D4AF37] text-black px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedImage.category}
                      </span>
                    </div>
                  )}

                  {selectedImage.createdAt && (
                    <p className="text-sm text-gray-500">
                      Added:{" "}
                      {new Date(
                        selectedImage.createdAt.toDate()
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
