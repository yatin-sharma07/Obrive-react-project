const { prisma } = require('../../../prisma');

class WorkSessionService {

  // =====================================================
  // INIT / START SESSION
  // =====================================================

  async startSession(userId) {
    try {

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find today's session
      let session = await prisma.work_sessions.findFirst({
        where: {
          userId,
          workDate: {
            gte: today
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      // -------------------------------------------------
      // CREATE NEW SESSION IF NONE EXISTS
      // -------------------------------------------------

      if (!session) {

        session = await prisma.work_sessions.create({
          data: {
            userId,
            workDate: new Date(),

            sessionStart: new Date(),

            startedAt: new Date(),

            lastHeartbeat: new Date(),

            totalActiveDuration: 0,

            status: 'active',

            isAutoEnded: false
          }
        });

        console.log(`✅ New work session created for user ${userId}`);
      }

      // -------------------------------------------------
      // RESUME EXISTING ENDED SESSION
      // -------------------------------------------------

      else if (session.status === 'ended') {

        session = await prisma.work_sessions.update({
          where: {
            id: session.id
          },
          data: {
            status: 'active',

            startedAt: new Date(),

            lastHeartbeat: new Date(),

            isAutoEnded: false,

            sessionEnd: null
          }
        });

        console.log(`🔄 Existing session resumed for user ${userId}`);
      }
      
      // -------------------------------------------------
      // ENSURE SESSION IS ACTIVE
      // -------------------------------------------------
      
      else if (session.status !== 'active') {
        
        console.warn(
          `⚠️ Session ${session.id} has unexpected status: ${session.status}. Reactivating.`
        );
        
        session = await prisma.work_sessions.update({
          where: {
            id: session.id
          },
          data: {
            status: 'active',
            startedAt: new Date(),
            lastHeartbeat: new Date(),
            isAutoEnded: false,
            sessionEnd: null
          }
        });
      }

      return this.buildSessionResponse(session);

    } catch (err) {

      console.error('❌ Error starting session:', err);

      throw err;
    }
  }

  // =====================================================
  // HEARTBEAT
  // =====================================================

  async recordHeartbeat(userId, sessionId) {

    try {

      let session = await prisma.work_sessions.findUnique({
        where: {
          id: sessionId
        }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      if (session.userId !== userId) {
        throw new Error('Unauthorized session access');
      }

      // If session is ended or inactive, try to reactivate it
      if (session.status !== 'active') {
        
        console.log(
          `⚠️ Heartbeat for inactive session ${sessionId}. Reactivating...`
        );
        
        session = await prisma.work_sessions.update({
          where: {
            id: sessionId
          },
          data: {
            status: 'active',
            startedAt: new Date(),
            lastHeartbeat: new Date(),
            isAutoEnded: false,
            sessionEnd: null
          }
        });
        
        return this.buildSessionResponse(session);
      }

      // Update heartbeat
      const updatedSession = await prisma.work_sessions.update({
        where: {
          id: sessionId
        },
        data: {
          lastHeartbeat: new Date()
        }
      });

      return this.buildSessionResponse(updatedSession);

    } catch (err) {

      console.error('❌ Heartbeat error:', err);

      throw err;
    }
  }

  // =====================================================
  // END SESSION
  // =====================================================

  async endSession(userId, sessionId) {

    try {

      const session = await prisma.work_sessions.findUnique({
        where: {
          id: sessionId
        }
      });

      if (!session) {
        throw new Error('Session not found');
      }

      if (session.userId !== userId) {
        throw new Error('Unauthorized');
      }

      // ---------------------------------------------
      // CALCULATE FINAL DURATION
      // ---------------------------------------------

      let totalDuration = session.totalActiveDuration;

      if (session.startedAt) {

        const elapsedSeconds =
          Math.floor(
            (Date.now() - new Date(session.startedAt).getTime()) / 1000
          );

        totalDuration += elapsedSeconds;
      }

      const endedSession = await prisma.work_sessions.update({
        where: {
          id: session.id
        },
        data: {
          totalActiveDuration: totalDuration,

          status: 'ended',

          sessionEnd: new Date(),

          startedAt: null,

          updated_at: new Date()
        }
      });

      console.log(`⏹️ Session ended for user ${userId}`);

      return this.buildSessionResponse(endedSession);

    } catch (err) {

      console.error('❌ End session error:', err);

      throw err;
    }
  }

  // =====================================================
  // GET TODAY SESSION
  // =====================================================

  async getTodaySession(userId) {

    try {

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const session = await prisma.work_sessions.findFirst({
        where: {
          userId,
          workDate: {
            gte: today
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      if (!session) {
        return null;
      }

      return this.buildSessionResponse(session);

    } catch (err) {

      console.error('❌ Error fetching session:', err);

      throw err;
    }
  }

  // =====================================================
  // AUTO END DEAD SESSIONS
  // =====================================================

  async autoEndInactiveSessions() {

    try {

      const cutoff = new Date(Date.now() - 15 * 60 * 1000);

      const sessions = await prisma.work_sessions.findMany({
        where: {
          status: 'active',
          lastHeartbeat: {
            lt: cutoff
          }
        }
      });

      for (const session of sessions) {

        let totalDuration = session.totalActiveDuration;

        if (session.startedAt) {

          const elapsedSeconds =
            Math.floor(
              (new Date(session.lastHeartbeat).getTime()
                - new Date(session.startedAt).getTime()) / 1000
            );

          totalDuration += elapsedSeconds;
        }

        await prisma.work_sessions.update({
          where: {
            id: session.id
          },
          data: {
            totalActiveDuration: totalDuration,

            status: 'ended',

            sessionEnd: new Date(),

            startedAt: null,

            isAutoEnded: true
          }
        });

        console.log(`⚠️ Auto-ended inactive session ${session.id}`);
      }

    } catch (err) {

      console.error('❌ Auto-end error:', err);
    }
  }

  // =====================================================
  // BUILD SESSION RESPONSE
  // =====================================================

  buildSessionResponse(session) {

    let liveDuration = session.totalActiveDuration;

    if (
      session.status === 'active' &&
      session.startedAt
    ) {

      const elapsedSeconds =
        Math.floor(
          (Date.now() - new Date(session.startedAt).getTime()) / 1000
        );

      liveDuration += elapsedSeconds;
    }

    return {
      id: session.id,

      userId: session.userId,

      status: session.status,

      startedAt: session.startedAt,

      sessionStart: session.sessionStart,

      sessionEnd: session.sessionEnd,

      lastHeartbeat: session.lastHeartbeat,

      totalActiveDuration: liveDuration,

      isAutoEnded: session.isAutoEnded
    };
  }
}

module.exports = new WorkSessionService();