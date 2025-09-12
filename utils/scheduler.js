import Box from "../models/Box.js";
import { sendCompletionEmail } from "./mailer.js";

export const COLORS = ["red", "yellow", "green", "blue", "pink", "grey"];

let intervalId = null;
let nextRunNumber = 1;

export async function initScheduler() {
  console.log("Initializing scheduler...");
  
  const lastBox = await Box.findOne().sort({ run: -1 }).lean();
  console.log("Last box found:", lastBox);
  
  const lastRun = lastBox && lastBox.run ? lastBox.run : 0;
  console.log("Last run number:", lastRun);

  if (lastRun >= 5) {
    console.log(
      "Scheduler already completed previously (run >= 5). No scheduler started."
    );
    return;
  }

  nextRunNumber = lastRun + 1;
  console.log("Next run number will be:", nextRunNumber);
  
  const intervalMs = process.env.INTERVAL_MS
    ? parseInt(process.env.INTERVAL_MS)
    : 60_000;
  const runImmediate = process.env.RUN_IMMEDIATE === "true";
  
  console.log("Interval MS:", intervalMs, "Run immediate:", runImmediate);

  async function runOnce() {
    try {
      const run = nextRunNumber;
      const count = Math.pow(2, run - 1);

      // Validate run number and count
      if (isNaN(run) || isNaN(count) || run < 1) {
        console.error(`Invalid run number: ${run}, count: ${count}. Resetting to 1.`);
        nextRunNumber = 1;
        return;
      }

      console.log(`Scheduler run #${run} — creating ${count} box(es).`);

      const docs = Array.from({ length: count }).map(() => ({
        height: 40,
        width: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        run,
      }));

      await Box.insertMany(docs);
      console.log(`Inserted ${docs.length} boxes (run ${run}).`);

      if (count >= 16) {
        console.log(
          "Reached 16 boxes. Stopping scheduler and sending completion email..."
        );
        try {
          await sendCompletionEmail(process.env.FULL_NAME || "");
          console.log("Email sent successfully after reaching 16 boxes");
        } catch (emailError) {
          console.error("Failed to send completion email:", emailError);
          // Continue with stopping the scheduler even if email fails
        }
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        return;
      }

      nextRunNumber += 1;
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  }

  if (runImmediate) {
    await runOnce();
  }

  intervalId = setInterval(runOnce, intervalMs);
  console.log(
    `Scheduler started (interval ${intervalMs}ms). Next run number: ${nextRunNumber}`
  );
}

export async function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  console.log("Scheduler stopped (manual).");
}

export async function resetScheduler() {
  console.log("Resetting scheduler...");
  await stopScheduler();
  nextRunNumber = 1;
  console.log("Scheduler reset. Next run will be #1");
}
