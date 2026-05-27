require('dotenv').config();

// Fix for BigInt serialization
BigInt.prototype.toJSON = function() {
  return this.toString();
};

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const { prisma, connectWithRetry } = require('./prisma');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const startWorkSessionCron = require('./src/jobs/workSessionCron');
const http = require('http');
const { initializeSocket } = require('./src/socket');

const app  = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');

// ── Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// ============================================
// ✅ PUBLIC TEST ENDPOINT (NO AUTH REQUIRED)
// ============================================
app.post('/api/employee/login-direct', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Login attempt: ${email}`);
    
    // Find employee - NO STATUS CHECK
    const result = await prisma.$queryRaw`
      SELECT id, email, name, role, status, password 
      FROM users 
      WHERE email = ${email} AND role = 'employee'
      LIMIT 1
    `;
    
    const employee = result[0];
    
    if (!employee) {
      console.log(`❌ Employee not found: ${email}`);
      return res.status(401).json({ success: false, message: 'Employee not found' });
    }
    
    console.log(`✅ Found employee: ${employee.email}, Status: ${employee.status}`);
    
    // Compare password
    const isValid = await bcrypt.compare(password, employee.password);
    
    if (!isValid) {
      console.log(`❌ Invalid password for: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: employee.id, email: employee.email, name: employee.name, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log(`✅ Login successful: ${email}`);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: employee.id,
          email: employee.email,
          name: employee.name,
          role: employee.role
        }
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// ✅ PUBLIC HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ======================================================================================
// 🔒 PROTECTED ROUTES (Require Authentication)
// ======================================================================================

//CRM Routes ===========================================================================
app.use('/api/auth',      require('./src/modules/auth/auth.routes'));
app.use('/api/employee',  require('./src/modules/employee/employee.routes'));
app.use('/api/clients',   require('./src/modules/clients/client.routes'));
app.use('/api/client',    require('./src/modules/clients/client.routes')); // alias for singular client path
app.use('/api/hr',        require('./src/modules/hr/hr.routes'));
app.use('/api/admin',     require('./src/modules/admin/admin.routes'));
app.use('/api/supervisor', require('./src/modules/supervisor/supervisor.routes'));
// app.use('/api/adduser', require('./src/modules/supervisor/supervisor.routes'));
app.use('/api/meetings',  require('./src/modules/meeting/meeting.routes'));
app.use('/api/projects',  require('./src/modules/projects/projects.routes'));
app.use('/api/tasks',     require('./src/modules/tasks/tasks.routes'));
app.use('/api/events',    require('./src/modules/events/events.routes'));
app.use('/api/sticky-notes', require('./src/modules/sticky-notes/sticky-notes.routes'));
// Calendar routes
app.use('/api/calendar', require('./src/modules/calendar/calendar.routes'));
// Vacations/Leaves routes
app.use('/api/vacations', require('./src/modules/vacations/vacations.routes'));
app.use('/api/leaves', require('./src/modules/leaves/leaves.routes'));
app.use('/api/profile', require('./src/modules/profile/profile.routes'));
// Timer routes
app.use('/api/work-sessions', require('./src/modules/work-sessions/work-sessions.routes'));
// Chat routes
app.use('/api/chat', require('./src/modules/chat/chat.routes'));
// AUDIO-ROOM Routes ===========================================================================
app.use( "/api/audio-room", require( "./src/modules/AUDIO_ROOM/livekit/routes/livekit.routes"));
app.use( "/api/audio-room", require( "./src/modules/AUDIO_ROOM/room-config/roomConfig.routes"));
app.use( "/api/audio-room", require( "./src/modules/AUDIO_ROOM/room-start/roomStart.routes"));
app.use( "/api/audio-room", require( "./src/modules/AUDIO_ROOM/room-end/roomEnd.routes"));
app.use( "/api/audio-room", require( "./src/modules/AUDIO_ROOM/room-join/roomJoin.routes"));
app.use( "/api/audio-room",  require("./src/modules/AUDIO_ROOM/room-list/roomList.routes"));
app.use( "/api/audio-room",  require("./src/modules/AUDIO_ROOM/room-details/roomDetails.routes"));
app.use(
  "/api/audio-room",
  require(
    "./src/modules/AUDIO_ROOM/room-leave/roomLeave.routes"
  )
);
app.use(
  "/api/audio-room",
  require(
    "./src/modules/AUDIO_ROOM/room-raise-hand/roomRaiseHand.routes"
  )
);
app.use(
  "/api/audio-room",
  require(
    "./src/modules/AUDIO_ROOM/room-hand-requests/roomHandRequests.routes"
  )
);
app.use(
  "/api/audio-room",
  require(
    "./src/modules/AUDIO_ROOM/room-hand-action/roomHandAction.routes"
  )
);
// ✅ MODERATION ROUTES
app.use(
  "/api/audio-room",
  require(
    "./src/modules/AUDIO_ROOM/speaker-mute/speakerMute.routes"
  )
);
app.use(
  "/api/audio-room",
  require(
    "./src/modules/AUDIO_ROOM/speaker-downgrade/speakerDowngrade.routes"
  )
);
app.use(
  "/api/audio-room",
  require(
    "./src/modules/AUDIO_ROOM/participant-remove/participantRemove.routes"
  )
);


// ── Error handler ─────────────────────────────────────────────
app.use(require('./src/middleware/errorHandler'));






// ── Start ─────────────────────────────────────────────────────
async function bootstrap() {
  try { 
    
    await connectWithRetry(5);

    console.log( '✅ Database connected' );
    // Start cron jobs
    startWorkSessionCron();

    // Initialize Socket.io
    initializeSocket(server);

    // Start server
    server.listen( PORT, '0.0.0.0', () => {
        console.log( `🚀 Server running on port ${PORT}` );
      }
    );
  } catch (err) {
    console.error( '🔴 Failed to start:', err );
    process.exit(1);
  }
}


bootstrap();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('🔌 DB disconnected. Shutting down.');
  process.exit(0);
});
