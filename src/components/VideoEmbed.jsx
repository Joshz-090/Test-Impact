import React from "react";
import { extractYouTubeId, extractTikTokId } from "../utils/eventUtils";

const VideoEmbed = ({ videoLink, className = "" }) => {
  if (!videoLink) return null;

  const youtubeId = extractYouTubeId(videoLink);
  const tiktokId = extractTikTokId(videoLink);

  if (youtubeId) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative w-full h-0 pb-[56.25%]">
          {" "}
          {/* 16:9 aspect ratio */}
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (tiktokId) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative w-full h-0 pb-[125%]">
          {" "}
          {/* TikTok aspect ratio */}
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.tiktok.com/embed/${tiktokId}`}
            title="TikTok video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // If it's not a recognized video platform, show a link
  return (
    <div className={`${className}`}>
      <a
        href={videoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        Watch Video
      </a>
    </div>
  );
};

export default VideoEmbed;
