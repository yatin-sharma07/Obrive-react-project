'use client';

import { useTimer }
from '@/context/TimerContext';


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(totalSeconds: number) {

  const hours =
    Math.floor(totalSeconds / 3600);

  const minutes =
    Math.floor((totalSeconds % 3600) / 60);

  const seconds =
    totalSeconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
}


// =====================================================
// TIMER COMPONENT
// =====================================================

export default function Timer() {

  const {
    displaySeconds,
    loading,
    session
  } = useTimer();


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <div className="text-sm font-medium text-gray-500">

        Loading timer...

      </div>
    );
  }


  // ===================================================
  // NO SESSION
  // ===================================================

  if (!session) {

    return (

      <div className="text-sm font-medium text-gray-400">

        No active session

      </div>
    );
  }


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="flex items-center gap-2">

      {/* Status Dot */}

      <div
        className={`
          w-2 h-2 rounded-full

          ${
            session.status === 'active'
              ? 'bg-green-500'
              : 'bg-red-500'
          }
        `}
      />

      {/* Timer */}

      <div className="font-semibold text-sm">

        {formatTime(displaySeconds)}

      </div>

    </div>
  );
}