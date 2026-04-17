require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function migrate() {
  console.log("🚀 Starting migration...\n");

  try {
    //  ADMIN
    const adminHash = await bcrypt.hash("admin123", 12);

    await prisma.users.upsert({
      where: { email: "admin@obrive.com" },
      update: {},
      create: {
        userid: "ADMIN001",
        email: "admin@obrive.com",
        password: adminHash,
        role: "ADMIN",
        isActive: true,
        name: "Admin User",
      },
    });

    console.log("✅ Admin → admin@obrive.com / admin123");

    //  HR
    const hrHash = await bcrypt.hash("hr123", 12);

    await prisma.users.upsert({
      where: { email: "hr001@obrive.com" },
      update: {},
      create: {
        userid: "HR001", // ✅ FIX
        email: "hr001@obrive.com",
        password: hrHash,
        role: "HR",
        isActive: true,
        name: "Sohni HR",
      },
    });

    console.log("✅ HR → hr001@obrive.com / hr123");

    //  EMPLOYEES
    const empPassword = await bcrypt.hash("employee123", 12);

    const employees = [
      { email: "john@obrive.com", name: "John Doe", userid: "EMP001" },
      { email: "jane@obrive.com", name: "Jane Smith", userid: "EMP002" },
      { email: "bob@obrive.com", name: "Bob Wilson", userid: "EMP003" },
      { email: "sarah@obrive.com", name: "Sarah Johnson", userid: "EMP004" },
      { email: "mike@obrive.com", name: "Mike Brown", userid: "EMP005" },
    ];

    for (const emp of employees) {
      await prisma.users.upsert({
        where: { email: emp.email },
        update: {},
        create: {
          userid: emp.userid, // ✅ already present
          email: emp.email,
          password: empPassword,
          role: "employee",
          isActive: true,
          name: emp.name,
        },
      });

      console.log(`✅ Employee → ${emp.email} / employee123`);
    }

    //  CLIENT
    const clientHash = await bcrypt.hash("client123", 12);

    await prisma.users.upsert({
      where: { email: "client@obrive.com" },
      update: {},
      create: {
        userid: "CLT001", // ✅ FIX
        email: "client@obrive.com",
        password: clientHash,
        role: "client",
        isActive: true,
        name: "Test Client",
      },
    });

    console.log("✅ Client → client@obrive.com / client123");

    //  SUMMARY
    console.log("\n─────────────────────────────────────────────");
    console.log("🎉 Migration complete!");
    console.log("─────────────────────────────────────────────");

    console.log("ADMIN    → admin@obrive.com  / admin123");
    console.log("HR       → hr001@obrive.com  / hr123");
    console.log("EMPLOYEE → john@obrive.com   / employee123");
    console.log("CLIENT   → client@obrive.com / client123");

    console.log("─────────────────────────────────────────────");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
