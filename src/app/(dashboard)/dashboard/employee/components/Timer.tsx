'use client';

import React, { useEffect, useState } from 'react';
import { useHeartbeat } from '../../../../../hooks/useHeartbeat';
import { useActivityDetection } from '../../../../../hooks/useActivityDetection';

interface TimerDisplay {
  hours: number;
  minutes: number;
  seconds: number;
}

export const Timer: React.FC = () => {
  const { heartbeatData } = useHeartbeat();
  const { isActive } = useActivityDetection();
  const [timerDisplay, setTimerDisplay] = useState<TimerDisplay>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Convert seconds to HH:MM:SS
  const formatTime = (value: number): string => {
    return String(value).padStart(2, '0');
  };

  // Update timer display every second
  useEffect(() => {
    const interval = setInterval(() => {
      const totalSeconds = heartbeatData.totalActiveDuration;
      
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimerDisplay({
        hours,
        minutes,
        seconds
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [heartbeatData.totalActiveDuration]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer Display */}
      <div className="text-center">
        <p className="text-xs text-primary/60 mb-2 font-medium">
          {isActive ? 'Working Hours' : 'INACTIVE - No Updates'}
        </p>
        <div className={`font-mono text-4xl font-bold tracking-wider ${
          heartbeatData.isSessionActive 
            ? isActive 
              ? 'text-primary' 
              : 'text-yellow-500'
            : 'text-red-500'
        }`}>
          {formatTime(timerDisplay.hours)}:{formatTime(timerDisplay.minutes)}:
          {formatTime(timerDisplay.seconds)}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          heartbeatData.isSessionActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`} />
        <span className="text-xs text-gray-600">
          {heartbeatData.isSessionActive ? 'Session Active' : 'Session Ended'}
        </span>
      </div>
    </div>
  );
};