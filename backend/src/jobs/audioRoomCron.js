const cron = require('node-cron');
const { prisma } = require('../../prisma');

function startAudioRoomCron() {
  console.log('🕒 Audio room cron initialized');

  cron.schedule('*/1 * * * *', async () => {
    const now = new Date();

    try {
      const result = await prisma.room_configs.updateMany({
        where: {
          roomStatus: 'scheduled',
          startTime: {
            not: null,
            lte: now,
          },
        },
        data: {
          roomStatus: 'live',
        },
      });

      if (result.count > 0) {
        console.log(`✅ Promoted ${result.count} scheduled room(s) to live`);
      }
    } catch (error) {
      console.error('❌ Audio room cron failed:', error);
    }
  });
}

module.exports = startAudioRoomCron;