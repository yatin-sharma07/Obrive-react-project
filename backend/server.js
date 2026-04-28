require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const { prisma } = require('./src/config/db');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');

const app  = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser'); // 👈 ADD THIS

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

// ============================================
// 🔒 PROTECTED ROUTES (Require Authentication)
// ============================================
app.use('/api/auth',      require('./src/modules/auth/auth.routes'));
app.use('/api/employee',  require('./src/modules/employee/employee.routes'));
app.use('/api/clients',   require('./src/modules/clients/client.routes'));
app.use('/api/client',    require('./src/modules/clients/client.routes')); // alias for singular client path
app.use('/api/hr',        require('./src/modules/hr/hr.routes'));
app.use('/api/admin',     require('./src/modules/admin/admin.routes'));
app.use('/api/meetings',  require('./src/modules/meeting/meeting.routes'));
app.use('/api/projects',  require('./src/modules/projects/projects.routes'));
app.use('/api/tasks',     require('./src/modules/tasks/tasks.routes'));
app.use('/api/events',    require('./src/modules/events/events.routes'));
app.use('/api/sticky-notes', require('./src/modules/sticky-notes/sticky-notes.routes'));
// Timer routes
app.use('/api/work-sessions', require('./src/modules/work-sessions/work-sessions.routes'));
// ── Error handler ─────────────────────────────────────────────
app.use(require('./src/middleware/errorHandler'));

// ── Start ─────────────────────────────────────────────────────
async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

// backend/server.js - Add this temporary endpoint
app.post('/api/temp/add-employee', async (req, res) => {
  try {
    const { userid, email, name, password } = req.body;
    const bcrypt = require('bcrypt');
    const { prisma } = require('./src/config/db');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.$executeRaw`
      INSERT INTO users (userid, email, name, role, password, status, created_at, updated_at) 
      VALUES (${userid}, ${email}, ${name}, 'employee', ${hashedPassword}, 'online', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET 
        password = ${hashedPassword},
        status = 'online',
        updated_at = NOW()
    `;
    
    res.json({ success: true, message: `Employee ${email} added/updated` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
bootstrap();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('🔌 DB disconnected. Shutting down.');
  process.exit(0);
});

