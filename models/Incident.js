import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  location: String,
  time: { type: Date, default: Date.now }
});

export default mongoose.model("Incident", incidentSchema);