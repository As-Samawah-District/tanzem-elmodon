import mongoose from "mongoose";

const logsSchema = new mongoose.Schema(
  {
    type: String,
    user: String,
    details: String,
    system: String,
    ip: String,
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", logsSchema);
export default Log;
