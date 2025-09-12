import express from "express";
import Box from "../models/Box.js";
import { COLORS } from "../utils/scheduler.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const boxes = await Box.find().sort({ createdAt: 1 });
  res.json(boxes);
});

router.get("/colors", (req, res) => {
  res.json(COLORS);
});

router.get("/stats", async (req, res) => {
  try {
    const totalBoxes = await Box.countDocuments();
    const lastRunBox = await Box.findOne().sort({ run: -1 }).lean();
    const lastRun = lastRunBox ? lastRunBox.run : 0;
    const nextRun = lastRun + 1;
    const emailSent = totalBoxes >= 16;
    
    res.json({
      totalBoxes,
      lastRun,
      nextRun,
      emailSent
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
});

router.post("/sort", async (req, res) => {
  const { colorOrder } = req.body;
  if (!Array.isArray(colorOrder))
    return res.status(400).json({ message: "colorOrder must be an array" });

  const boxes = await Box.find().lean();
  const orderMap = new Map(colorOrder.map((c, i) => [c, i]));

  boxes.sort((a, b) => {
    const ai = orderMap.has(a.color) ? orderMap.get(a.color) : Infinity;
    const bi = orderMap.has(b.color) ? orderMap.get(b.color) : Infinity;
    return ai - bi;
  });

  res.json(boxes);
});

export default router;
