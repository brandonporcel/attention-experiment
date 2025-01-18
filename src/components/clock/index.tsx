import React, { useEffect } from "react";

type ClockProps = {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  onTimerEnd: () => void;
};

export default function Clock({
  time,
  setTime,
  limit,
  onTimerEnd,
}: ClockProps) {
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime >= limit) {
          clearInterval(timer);
          onTimerEnd();
          return prevTime;
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setTime, limit, onTimerEnd]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return <p className="text-xl font-bold">{formatTime(time)}</p>;
}
