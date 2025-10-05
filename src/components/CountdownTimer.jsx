import React, { useState, useEffect } from "react";

const CountdownTimer = ({ eventDate, eventTime, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isEventStarted, setIsEventStarted] = useState(false);

  useEffect(() => {
    if (!eventDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDateTime = new Date(`${eventDate}T${eventTime || "00:00"}`);
      const difference = eventDateTime.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsEventStarted(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsEventStarted(true);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [eventDate, eventTime]);

  if (isEventStarted) {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold text-lg animate-pulse">
          🎉 Event Started! Live Now!
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((item, index) => (
          <div key={index} className="text-center">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-black font-bold text-xl sm:text-2xl md:text-3xl py-2 px-1 sm:px-2 rounded-lg shadow-lg">
              {item.value.toString().padStart(2, "0")}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
