import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import boxRoutes from "./routes/boxes.js";
import { initScheduler, stopScheduler, resetScheduler } from "./utils/scheduler.js";
import { testEmailConfiguration, sendCompletionEmail } from "./utils/mailer.js";

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://scheduler-task-frontend.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use("/api/boxes", boxRoutes);

app.post("/api/admin/stop-scheduler", async (req, res) => {
  await stopScheduler();
  res.json({ stopped: true });
});

app.post("/api/admin/reset-scheduler", async (req, res) => {
  await resetScheduler();
  res.json({ reset: true });
});

app.post("/api/admin/test-email", async (req, res) => {
  try {
    const isValid = await testEmailConfiguration();
    res.json({ 
      success: isValid, 
      message: isValid ? "Email configuration is valid" : "Email configuration failed" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Email test failed", 
      error: error.message 
    });
  }
});

app.post("/api/admin/send-test-email", async (req, res) => {
  try {
    const info = await sendCompletionEmail("Test User");
    res.json({ 
      success: true, 
      message: "Test email sent successfully", 
      messageId: info.messageId 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to send test email", 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    await initScheduler();
  } catch (err) {
    console.error("Start error:", err);
    process.exit(1);
  }
}

start();
