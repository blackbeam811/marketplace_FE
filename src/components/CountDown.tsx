"use client";
import React, { useCallback, useEffect, useState } from "react";
interface CountdownProps {
  timestamp: number;
}

const Countdown: React.FC<CountdownProps> = ({ timestamp }) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = timestamp - new Date().getTime();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return timeLeft;
  }, [timestamp]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, timestamp]);

  const formatTimeUnit = (unit: number) => (unit < 10 ? `0${unit}` : unit);

  return (
    <div className="flex items-center justify-center flex-row gap-1">
      <span>End:</span>
      <div className="flex gap-1">
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="font-bold text-white text-sm">
            {formatTimeUnit(timeLeft.days)} :
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="font-bold text-white text-sm">
            {formatTimeUnit(timeLeft.hours)} :
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="font-bold text-white text-sm">
            {formatTimeUnit(timeLeft.minutes)} :
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <span className="font-bold text-white text-sm">
            {formatTimeUnit(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
