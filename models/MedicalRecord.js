import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  conditions: [String],
  allergies: [String],
  medications: [String],
  notes: String
});

export default mongoose.model("MedicalRecord", medicalSchema);