require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { prisma } = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

//  SECURITY MIDDLEWARE
app.use(helmet());

//  CORS (REQUIRED FOR COOKIES)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // 🔥 REQUIRED for cookies
  }),
);

// COOKIE PARSER
app.use(cookieParser());

//  BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  LOGGER
app.use(morgan("dev"));

// ROUTES
app.use("/api/auth", require("./src/modules/auth/auth.routes"));
app.use("/api/employees", require("./src/modules/employee/employee.routes"));
app.use("/api/hr", require("./src/modules/hr/hr.routes"));
app.use("/api/admin", require("./src/modules/admin/admin.routes"));
app.use("/api/meetings", require("./src/modules/meeting/meeting.routes"));
app.use(
  "/api/onboarding",
  require("./src/modules/onboarding/onboarding.routes"),
);

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
  });
});

//  ERROR HANDLER
app.use(require("./src/middleware/errorHandler"));

//  START SERVER
async function bootstrap() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start:", err);
    process.exit(1);
  }
}

bootstrap();

// GRACEFUL SHUTDOWN
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  await prisma.$disconnect();
  process.exit(0);
});
