// backend/src/modules/auth/auth.service.js
const { prisma }          = require('../../config/db');
const { comparePassword } = require('../../utils/bcrypt');
const bcrypt = require('bcrypt');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../../utils/jwt');

// Employee / HR / Admin login
exports.loginUser = async ({ email, password, ip, userAgent }) => {
  // Use raw query to find user by email
  const result = await prisma.$queryRaw`
    SELECT id, userid, email, name, role, password, status 
    FROM users 
    WHERE email = ${email} AND (role = 'employee' OR role = 'hr' OR role = 'admin')
    LIMIT 1
  `;
  
  const user = result[0];
  
  if (!user) {
    throw { status: 401, message: 'Invalid credentials or inactive account' };
  }
  //temp removing strict status check
  //if (user.status !== 'online' && user.status !== 'active') {
    //throw { status: 401, message: 'Invalid credentials or inactive account' };
  //}
  
  // Compare password - handles both plain text and hashed
 
  
  // Check if password is bcrypt hash (starts with $2b$)
 const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    throw { status: 401, message: 'Invalid credentials' };
  }
  
  // Log login
  let log = null;
  try {
    const logResult = await prisma.$queryRaw`
      INSERT INTO login_logs (user_id, ip_address, user_agent, success, created_at)
      VALUES (${user.id}, ${ip}, ${userAgent}, true, NOW())
      RETURNING id
    `;
    log = logResult[0];
  } catch (err) {
    console.log('Login log not recorded - table might not exist');
  }
  
  const payload = { id: user.id, role: user.role, logId: log?.id };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: user.id });
  
  return {
    accessToken,
    refreshToken,
    logId: log?.id,
    user: { 
      id: user.id, 
      userid: user.userid,
      email: user.email, 
      name: user.name,
      role: user.role 
    },
  };
};

// Client login
exports.loginClient = async ({ clientId, password }) => {
  const result = await prisma.$queryRaw`
    SELECT id, userid, email, name, role, password, status 
    FROM users 
    WHERE userid = ${clientId} AND role = 'client'
    LIMIT 1
  `;
  
  const client = result[0];
  
  if (!client || client.status === 'inactive') {
    throw { status: 401, message: 'Invalid client credentials' };
  }
  
  // Clients don't need password check (or implement if needed)
  // if (client.password && client.password !== password) {
  //   throw { status: 401, message: 'Invalid credentials' };
  // }
  
  const payload = { id: client.id, role: 'CLIENT', clientId: client.userid };
  const accessToken = signAccessToken(payload);
  
  return {
    accessToken,
    client: { 
      id: client.id, 
      clientId: client.userid, 
      name: client.name,
      email: client.email
    },
  };
};

// Logout
exports.logout = async ({ userId, logId }) => {
  try {
    const log = await prisma.$queryRaw`
      SELECT id, login_time FROM login_logs 
      WHERE user_id = ${userId} AND id = ${logId} AND logout_time IS NULL
      LIMIT 1
    `;
    
    if (!log[0]) throw { status: 404, message: 'Active session not found' };
    
    const logoutTime = new Date();
    const sessionDuration = Math.floor((logoutTime - log[0].login_time) / 1000);
    
    await prisma.$executeRaw`
      UPDATE login_logs 
      SET logout_time = ${logoutTime}, session_duration = ${sessionDuration}
      WHERE id = ${logId}
    `;
    
    return { sessionDuration, message: 'Logged out successfully' };
  } catch (err) {
    throw { status: 404, message: 'Active session not found' };
  }
};

// Refresh token
exports.refreshToken = async (token) => {
  try {
    const payload = verifyRefreshToken(token);
    const user = await prisma.$queryRaw`
      SELECT id, role FROM users WHERE id = ${payload.id} LIMIT 1
    `;
    
    if (!user[0]) throw { status: 401, message: 'User not found' };
    
    const newAccess = signAccessToken({ id: user[0].id, role: user[0].role });
    return { accessToken: newAccess };
  } catch {
    throw { status: 403, message: 'Invalid or expired refresh token' };
  }
};

// Get all datat for user

exports.getAllUsers = async () => {
  const query = `
    SELECT 
      id,
      userid,
      email,
      name,
      role,
      status,
      date_of_birth,
      bio,
      phone_number,
      created_at
    FROM users
    ORDER BY created_at DESC
  `;

  const { rows } = await db.query(query);
  return rows;
};