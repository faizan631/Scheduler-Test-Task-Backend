import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import boxRoutes from "./routes/boxes.js";
import { initScheduler, stopScheduler, resetScheduler } from "./utils/scheduler.js";

const app = express();
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.use("/api/boxes", boxRoutes);

app.post("/api/admin/stop-scheduler", async (req, res) => {
  await stopScheduler();
  res.json({ stopped: true });
});

app.post("/api/admin/reset-scheduler", async (req, res) => {
  await resetScheduler();
  res.json({ reset: true });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    console.log("Starting server...");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Port:", PORT);
    
    await connectDB();
    console.log("Database connected successfully");
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Server listening on 0.0.0.0:${PORT}`);
    });
    
    // Add error handling for server
    server.on('error', (err) => {
      console.error('Server error:', err);
    });
    
    await initScheduler();
    console.log("Scheduler initialized");
  } catch (err) {
    console.error("Start error:", err);
    console.error("Error stack:", err.stack);
    process.exit(1);
  }
}

start();
