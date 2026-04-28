const { prisma } = require('../../config/db');

class WorkSessionService {
  
  // 1. START NEW SESSION
  async startSession(userId) {
    try {
      // Check if there's an active session for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingSession = await prisma.work_sessions.findFirst({
        where: {
          userId: userId,
          status: 'active',
          sessionStart: { gte: today }
        }
      });

      if (existingSession) {
        return existingSession;  // Return existing session (handles multiple tabs)
      }

      // Create new session
      const session = await prisma.work_sessions.create({
        data: {
          userId: userId,
          sessionStart: new Date(),
          lastHeartbeat: new Date(),
          totalActiveDuration: 0,
          status: 'active'
        }
      });

      console.log(`✓ Session started for user ${userId}: ${session.id}`);
      return session;
    } catch (err) {
      console.error('Error starting session:', err.message);
      throw err;
    }
  }

  // 2. HEARTBEAT - Update session with time calculation
  async recordHeartbeat(userId, sessionId) {
    try {
      const currentTime = new Date();
      
      // Get current session
      const session = await prisma.work_sessions.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      // Verify ownership
      if (session.userId !== userId) {
        throw new Error('Unauthorized: Session does not belong to this user');
      }

      // Check if session should be auto-ended (no heartbeat for 2 mins)
      const timeSinceLastHeartbeat = (currentTime - session.lastHeartbeat) / 1000; // in seconds
      
      if (timeSinceLastHeartbeat > 120 && session.status === 'active') {
        // Auto-end session if no heartbeat for > 2 minutes
        await prisma.work_sessions.update({
          where: { id: sessionId },
          data: {
            status: 'ended',
            sessionEnd: currentTime,
            isAutoEnded: true,
            lastHeartbeat: currentTime
          }
        });
        throw new Error('Session auto-ended: No heartbeat for more than 2 minutes');
      }

      // Calculate time difference (but cap at 2 minutes to avoid anomalies)
      let timeDiff = (currentTime - session.lastHeartbeat) / 1000;
      if (timeDiff > 120) {
        timeDiff = 120;  // Cap at 2 minutes
      }

      // Update session with new active duration
      const updatedSession = await prisma.work_sessions.update({
        where: { id: sessionId },
        data: {
          lastHeartbeat: currentTime,
          totalActiveDuration: session.totalActiveDuration + Math.floor(timeDiff),
          updated_at: currentTime
        }
      });

      return updatedSession;
    } catch (err) {
      console.error('Error recording heartbeat:', err.message);
      throw err;
    }
  }

  // 3. END SESSION
  async endSession(userId, sessionId) {
    try {
      const currentTime = new Date();
      
      const session = await prisma.work_sessions.findUnique({
        where: { id: sessionId }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      if (session.userId !== userId) {
        throw new Error('Unauthorized');
      }

      // Calculate final duration
      const finalDuration = session.totalActiveDuration + 
        Math.floor((currentTime - session.lastHeartbeat) / 1000);

      const endedSession = await prisma.work_sessions.update({
        where: { id: sessionId },
        data: {
          status: 'ended',
          sessionEnd: currentTime,
          totalActiveDuration: finalDuration,
          updated_at: currentTime
        }
      });

      console.log(`✓ Session ended for user ${userId}. Total duration: ${finalDuration}s`);
      return endedSession;
    } catch (err) {
      console.error('Error ending session:', err.message);
      throw err;
    }
  }

  // 4. GET TODAY'S SESSION
  async getTodaySession(userId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const session = await prisma.work_sessions.findFirst({
        where: {
          userId: userId,
          sessionStart: { gte: today }
        },
        orderBy: { sessionStart: 'desc' }
      });

      return session;
    } catch (err) {
      console.error('Error fetching today session:', err.message);
      throw err;
    }
  }

  // 5. GET SESSION STATS FOR DAY
  async getDayStats(userId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const sessions = await prisma.work_sessions.findMany({
        where: {
          userId: userId,
          sessionStart: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      // Calculate total time
      const totalSeconds = sessions.reduce((sum, session) => {
        if (session.status === 'ended') {
          return sum + session.totalActiveDuration;
        }
        // For active sessions, add current time diff
        return sum + session.totalActiveDuration + 
          Math.floor((new Date() - session.lastHeartbeat) / 1000);
      }, 0);

      return {
        totalSessions: sessions.length,
        activeSessions: sessions.filter(s => s.status === 'active').length,
        totalActiveDuration: totalSeconds,
        sessions: sessions
      };
    } catch (err) {
      console.error('Error fetching day stats:', err.message);
      throw err;
    }
  }

  // 6. AUTO-END INACTIVE SESSIONS (Run periodically)
  async autoEndInactiveSessions() {
    try {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

      const inactiveSessions = await prisma.work_sessions.updateMany({
        where: {
          status: 'active',
          lastHeartbeat: { lt: twoMinutesAgo }
        },
        data: {
          status: 'ended',
          sessionEnd: new Date(),
          isAutoEnded: true
        }
      });

      console.log(`Auto-ended ${inactiveSessions.count} inactive sessions`);
      return inactiveSessions;
    } catch (err) {
      console.error('Error auto-ending sessions:', err.message);
      throw err;
    }
  }
}

module.exports = new WorkSessionService();