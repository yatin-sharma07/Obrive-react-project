const { prisma } = require("../../config/db");
const { hashPassword } = require("../../utils/bcrypt");
const { signAccessToken } = require("../../utils/jwt");
const crypto = require("crypto");

// Generate 4-digit OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// Send OTP
exports.sendOtp = async (phone) => {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Delete old OTPs for this phone
  await prisma.otpVerification.deleteMany({ where: { phone } });

  await prisma.otpVerification.create({
    data: { phone, otp, expiresAt },
  });

  // In production: integrate Twilio/MSG91 here to send real SMS
  // For now log it (remove in production)
  console.log(`OTP for ${phone}: ${otp}`);

  return {
    message: `OTP sent to ${phone}`,
    // Remove otp from response in production — only for dev/testing
    ...(process.env.NODE_ENV === "development" && { otp }),
  };
};

// Verify OTP + Register
exports.verifyOtpAndRegister = async ({ phone, otp, email, password }) => {
  // Check OTP
  const record = await prisma.otpVerification.findFirst({
    where: { phone, isVerified: false },
    orderBy: { createdAt: "desc" },
  });

  if (!record)
    throw { status: 400, message: "OTP not found. Please request a new one." };

  if (record.otp !== otp) throw { status: 400, message: "Invalid OTP" };

  if (new Date() > record.expiresAt)
    throw { status: 400, message: "OTP expired. Please request a new one." };

  // Check email not already used
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw { status: 409, message: "Email already registered" };

  // Mark OTP as verified
  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { isVerified: true },
  });

  // Create user + profile in transaction
  const hash = await hashPassword(password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, password: hash, role: "EMPLOYEE", isActive: true },
    });
    const profile = await tx.userProfile.create({
      data: { userId: user.id, phone, isVerified: true },
    });
    return { user, profile };
  });

  const accessToken = signAccessToken({
    id: result.user.id,
    role: result.user.role,
    email: result.user.email,
  });

  return {
    accessToken,
    user: {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      phone,
    },
    nextStep: 2,
  };
};

// About yourself
exports.aboutYourself = async (userId, { useCase, describes }) => {
  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: { useCase, role: describes },
    create: { userId, useCase, role: describes },
  });
  return { profile, nextStep: 3 };
};

// Company info
exports.companyInfo = async (
  userId,
  { companyName, businessDirection, teamSize },
) => {
  // Create or update org
  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId },
  });

  let org;
  if (existingProfile?.orgId) {
    org = await prisma.organization.update({
      where: { id: existingProfile.orgId },
      data: { companyName, businessDirection, teamSize },
    });
  } else {
    org = await prisma.organization.create({
      data: { companyName, businessDirection, teamSize, createdBy: userId },
    });
    // Link user to org
    await prisma.user.update({
      where: { id: userId },
      data: { orgId: org.id },
    });
    await prisma.userProfile.update({
      where: { userId },
      data: { orgId: org.id },
    });
  }

  return { org, nextStep: 4 };
};

// Invite members
exports.inviteMembers = async (userId, emails) => {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile?.orgId)
    throw {
      status: 400,
      message: "Please complete company info first (step 3)",
    };

  const invites = [];

  for (const email of emails) {
    // Skip if already a user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) continue;

    // Skip if invite already sent
    const alreadyInvited = await prisma.memberInvite.findFirst({
      where: { email, orgId: profile.orgId, status: "pending" },
    });
    if (alreadyInvited) continue;

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = await prisma.memberInvite.create({
      data: {
        email,
        invitedBy: userId,
        orgId: profile.orgId,
        token,
        expiresAt,
      },
    });

    // In production: send invite email here with link:
    // `${process.env.CLIENT_URL}/accept-invite/${token}`
    console.log(`Invite sent to ${email} — token: ${token}`);

    invites.push({ email, token });
  }

  return {
    invited: invites.length,
    invites: process.env.NODE_ENV === "development" ? invites : undefined,
    message: `${invites.length} invitation(s) sent`,
    nextStep: "complete",
  };
};

// Accept Invite
exports.acceptInvite = async (token) => {
  const invite = await prisma.memberInvite.findUnique({ where: { token } });

  if (!invite) throw { status: 404, message: "Invalid invite link" };

  if (invite.status === "accepted")
    throw { status: 400, message: "Invite already accepted" };

  if (new Date() > invite.expiresAt)
    throw { status: 400, message: "Invite link has expired" };

  await prisma.memberInvite.update({
    where: { id: invite.id },
    data: { status: "accepted" },
  });

  return {
    message: "Invite accepted. Please complete your registration.",
    email: invite.email,
    orgId: invite.orgId,
  };
};
