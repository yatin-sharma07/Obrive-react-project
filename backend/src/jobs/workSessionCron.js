const cron = require('node-cron');

const workSessionService =
  require('../modules/work-sessions/work-sessions.service');


// =====================================================
// AUTO END INACTIVE SESSIONS
// =====================================================

function startWorkSessionCron() {

  console.log('🕒 Work session cron initialized');

  // Every 5 minutes
  cron.schedule('*/5 * * * *', async () => {

    console.log('🔍 Checking inactive sessions...');

    try {

      await workSessionService
        .autoEndInactiveSessions();

    } catch (err) {

      console.error(
        '❌ Cron job failed:',
        err
      );
    }
  });
}

module.exports = startWorkSessionCron;