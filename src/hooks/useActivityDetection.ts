'use client';

import { useEffect, useRef } from 'react';

export const useActivityDetection = () => {
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef<boolean>(true);

  useEffect(() => {
    const resetInactivityTimer = () => {
      isActiveRef.current = true;

      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }

      // If no activity for 5 minutes, mark as inactive
      inactivityTimeoutRef.current = setTimeout(() => {
        isActiveRef.current = false;
        console.log('User inactive for 5 minutes');
      }, 5 * 60 * 1000);
    };

    // Listen for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // Initial timer
    resetInactivityTimer();

    // Handle page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Tab hidden - pausing heartbeat');
        if (inactivityTimeoutRef.current) {
          clearTimeout(inactivityTimeoutRef.current);
        }
      } else {
        console.log('Tab visible - resuming heartbeat');
        resetInactivityTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, []);

  return { isActive: isActiveRef.current };
};