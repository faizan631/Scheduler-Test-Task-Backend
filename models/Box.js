import mongoose from "mongoose";

const boxSchema = new mongoose.Schema({
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  color: { type: String, required: true },
  run: { type: Number, required: true },
}, {
  timestamps: true
});

export default mongoose.model("Box", boxSchema);
