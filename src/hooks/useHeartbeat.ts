'use client';

import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface HeartbeatData {
  sessionId: number | null;
  totalActiveDuration: number;
  isSessionActive: boolean;
}

export const useHeartbeat = () => {
  const [heartbeatData, setHeartbeatData] = useState<HeartbeatData>({
    sessionId: null,
    totalActiveDuration: 0,
    isSessionActive: false,
  });

  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<number | null>(null);
  const lastServerDurationRef = useRef<number>(0);
  const timerStartTimeRef = useRef<number>(0);

  // START SESSION on mount
  useEffect(() => {
    const startSession = async () => {
      try {
        const response = await apiFetch('/work-sessions/start-session', {
          method: 'POST',
        });

        const data = await response.json();
        
        if (data.success) {
          sessionIdRef.current = data.data.sessionId;
          lastServerDurationRef.current = data.data.totalActiveDuration;
          timerStartTimeRef.current = Date.now();

          setHeartbeatData(prev => ({
            ...prev,
            sessionId: data.data.sessionId,
            totalActiveDuration: data.data.totalActiveDuration,
            isSessionActive: true
          }));

          startHeartbeat(data.data.sessionId);
          startLocalTimer();
        }
      } catch (err) {
        console.error('Failed to start session:', err);
      }
    };

    startSession();

    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // LOCAL TIMER - updates every 1 second for smooth UI
  const startLocalTimer = () => {
    timerIntervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - timerStartTimeRef.current) / 1000);
      const displayDuration = lastServerDurationRef.current + elapsedSeconds;

      setHeartbeatData(prev => ({
        ...prev,
        totalActiveDuration: displayDuration,
        isSessionActive: true
      }));
    }, 1000);  // Update every 1 second
  };

  // SERVER HEARTBEAT - every 45 seconds
  const startHeartbeat = (sessionId: number) => {
    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        const response = await apiFetch('/work-sessions/heartbeat', {
          method: 'POST',
          body: JSON.stringify({ sessionId: sessionId })
        });

        const data = await response.json();

        if (data.success) {
          // Sync to server value and reset timer
          lastServerDurationRef.current = data.data.totalActiveDuration;
          timerStartTimeRef.current = Date.now();

          setHeartbeatData(prev => ({
            ...prev,
            totalActiveDuration: data.data.totalActiveDuration,
            isSessionActive: data.data.status === 'active'
          }));
        } else if (response.status === 410) {
          setHeartbeatData(prev => ({
            ...prev,
            isSessionActive: false
          }));
          if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }
      } catch (err) {
        console.error('Heartbeat error:', err);
      }
    }, 45000);  // Every 45 seconds
  };

  const endSession = async () => {
    if (!sessionIdRef.current) return;

    try {
      await apiFetch('/work-sessions/end-session', {
        method: 'POST',
        body: JSON.stringify({ sessionId: sessionIdRef.current })
      });

      setHeartbeatData(prev => ({
        ...prev,
        isSessionActive: false
      }));

      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  return {
    heartbeatData,
    endSession,
    totalActiveDuration: heartbeatData.totalActiveDuration
  };
};