'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { apiFetch } from '@/lib/api';
// import axios from 'axios';

interface SessionData {
  id: number;
  status: string;
  startedAt: string | null;
  totalActiveDuration: number;
  lastHeartbeat?: string | null;
}

interface TimerContextType {

  session: SessionData | null;

  displaySeconds: number;

  loading: boolean;
}

const TimerContext =
  createContext<TimerContextType | null>(null);


// =====================================================
// PROVIDER
// =====================================================

export function TimerProvider({
  children
}: {
  children: React.ReactNode
}) {

  const [session, setSession] =
    useState<SessionData | null>(null);

  const [displaySeconds, setDisplaySeconds] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const timerIntervalRef =
    useRef<NodeJS.Timeout | null>(null);

  const heartbeatIntervalRef =
    useRef<NodeJS.Timeout | null>(null);

  const sessionRefreshRef =
    useRef<NodeJS.Timeout | null>(null);


  // ===================================================
  // INITIALIZE SESSION
  // ===================================================

  useEffect(() => {

    initializeSession();

    return () => {

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      if (sessionRefreshRef.current) {
        clearInterval(sessionRefreshRef.current);
      }
    };

  }, []);


  // ===================================================
  // INIT
  // ===================================================

async function initializeSession() {

  try {

    setLoading(true);

    // --------------------------------------------
    // FIRST TRY FETCH EXISTING SESSION
    // --------------------------------------------

            let sessionData = null;

        try {
          const existingResponse = await apiFetch('/work-sessions/current');
          
          if (existingResponse.ok) {
            const existingJson = await existingResponse.json();
            sessionData = existingJson.data;
          }
          // If 401 or any error, just continue to create new session
          
        } catch (err) {
          console.log('Continuing to create new session...');
        }

    // --------------------------------------------
    // CREATE ONLY IF NONE EXISTS
    // --------------------------------------------

    if (!sessionData) {

        const response = await apiFetch('/work-sessions/init', {
          method: 'POST'
        });

        const json =
          await response.json();

          console.log(
                      'INIT SESSION RESPONSE:',
                      json
                    );

        sessionData =
          json.data;
            }

    // --------------------------------------------
    // STORE SESSION
    // --------------------------------------------

    setSession(sessionData);

    startHeartbeat(sessionData.id);

    startSessionRefresh();

  } catch (err) {

    console.error(
      '❌ Timer initialization failed:',
      err
    );

  } finally {

    setLoading(false);
  }
}


  // ===================================================
  // VISUAL TIMER - RUNS CONTINUOUSLY
  // ===================================================

  useEffect(() => {

    if (!session) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    const updateTimer = () => {

      let total = session.totalActiveDuration || 0;

      if (
        session.status === 'active' &&
        session.startedAt
      ) {

        const startedAtMs = new Date(session.startedAt).getTime();

        const elapsed = Math.floor(
          (Date.now() - startedAtMs) / 1000
        );

        total += elapsed;
      }

      setDisplaySeconds(total);
    };

    // Initial render
    updateTimer();

    // Tick every second
    timerIntervalRef.current =
      setInterval(updateTimer, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };

  }, [session]);


  // ===================================================
  // HEARTBEAT (PROVE USER IS ALIVE)
  // ===================================================

  function startHeartbeat(sessionId: number) {

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    // Every 30 seconds - aggressive enough to prove life
    // Backend auto-ends if no heartbeat for 15 minutes
    heartbeatIntervalRef.current =
      setInterval(async () => {

        try {

          const response = await apiFetch('/work-sessions/heartbeat', {
            method: 'POST',
            body: JSON.stringify({ sessionId })
          });

          if (response.ok) {
            const data = await response.json();
            
            // CRITICAL: Update session state from heartbeat
            // This syncs totalActiveDuration calculated by backend
            if (data.data) {
              setSession(data.data);
              
              console.log('✅ Heartbeat synced. Duration:', data.data.totalActiveDuration);
            }
          }

        } catch (err) {

          console.error('❌ Heartbeat failed:', err);
        }

      }, 30 * 1000); // 30 seconds
  }


  // ===================================================
  // SESSION REFRESH (PERIODIC SYNC)
  // ===================================================

  function startSessionRefresh() {

    if (sessionRefreshRef.current) {
      clearInterval(sessionRefreshRef.current);
    }

    // Every 3 minutes - refresh full session state
    // Ensures frontend never gets too out of sync with backend
    sessionRefreshRef.current =
      setInterval(async () => {

        try {

          const response = await apiFetch('/work-sessions/current');

          if (response.ok) {
            const data = await response.json();
            
            if (data.data) {
              setSession(data.data);
              
              console.log('🔄 Session refreshed. Duration:', data.data.totalActiveDuration);
            }
          }

        } catch (err) {

          console.error('❌ Session refresh failed:', err);
        }

      }, 3 * 60 * 1000); // 3 minutes
  }


  return (

    <TimerContext.Provider
      value={{
        session,
        displaySeconds,
        loading
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}


// =====================================================
// HOOK
// =====================================================

export function useTimer() {

  const context =
    useContext(TimerContext);

  if (!context) {

    throw new Error(
      'useTimer must be used inside TimerProvider'
    );
  }

  return context;
}