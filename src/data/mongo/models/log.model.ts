import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
    default: "low",
  },
  message: { type: String, requied: true },
  origin: String,
  createdAt: { type: Date, default: new Date() },
});

export const LogModel = mongoose.model("Log", logSchema);
