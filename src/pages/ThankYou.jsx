import React from "react";

const ThankYou = () => (
  <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-black sm:text-5xl">Thank You!</h1>
      <p className="mt-4 text-lg text-black">
        Your project inquiry has been received. Our team will get in touch soon.
      </p>
      <a
        href="/"
        className="mt-6 inline-block px-6 py-3 bg-[#d4af37] text-black font-semibold rounded-md hover:bg-black hover:text-white transition-colors duration-300"
      >
        Return to Home
      </a>
    </div>
  </div>
);

export default ThankYou;
