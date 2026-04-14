require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const { prisma } = require('./src/config/db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',      require('./src/modules/auth/auth.routes'));
app.use('/api/employees', require('./src/modules/employee/employee.routes'));
app.use('/api/clients',   require('./src/modules/client/client.routes'));
app.use('/api/hr',        require('./src/modules/hr/hr.routes'));
app.use('/api/admin',     require('./src/modules/admin/admin.routes'));
app.use('/api/meetings',  require('./src/modules/meeting/meeting.routes'));
app.use('/api/onboarding', require('./src/modules/onboarding/onboarding.routes'));


// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ── Error handler ─────────────────────────────────────────────
app.use(require('./src/middleware/errorHandler'));

// ── Start ─────────────────────────────────────────────────────
async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

bootstrap();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log(' DB disconnected. Shutting down.');
  process.exit(0);
});